import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./File.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCheckAuth } from "../hooks/useAuthCheck";
import { SERVER } from "../constants";

const File = ({ fileId, role, socket }) => {
  const [language, setLanguage] = useState("plaintext");
  const [userCursors, setUserCursors] = useState({});
  const [fileContent, setFileContent] = useState("");


  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const isRemoteChange = useRef(false);

  const checkAuth = useCheckAuth();

  const extensionToLang = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    json: "json",
    html: "html",
    css: "css",
    cpp: "cpp",
    java: "java",
  };

  useEffect(() => {
    checkAuth("/login");
  }, []);

  useEffect(() => {
    if (!fileId) return;

    const fetchFile = async () => {
      const res = await axios.get(`${SERVER}/file/get/${fileId}`, {
        withCredentials: true,
      });

      const file = res.data.file;

      const ext = file.name.split(".").pop();
      setLanguage(extensionToLang[ext] || "plaintext");
      console.log("FILE from DB: ",file.content)

      setFileContent(file.content);
    };

    fetchFile();
  }, [fileId]);

  useEffect(() => {
    if (!socket) return;

    const handleRemoteEdits = (data) => {
      if (data.fileId !== fileId) return;
      if (data.sender === socket.id) return;

      const editor = editorRef.current;
      if (!editor) return;

      isRemoteChange.current = true;
      editor.executeEdits("remote", data.changes);
      isRemoteChange.current = false;
    };

    socket.on("client-edits", handleRemoteEdits);

    return () => socket.off("client-edits", handleRemoteEdits);
  }, [socket, fileId]);

  useEffect(() => {
    if (!socket) return;

    const handleCursorUpdate = (data) => {
      if (data.fileId !== fileId) return;

      setUserCursors((prev) => ({
        ...prev,
        [data.sender]: {
          position: data.position,
          username: data.username,
          color: data.color || "#ff4d4d",
        },
      }));
    };

    socket.on("client-cursor", handleCursorUpdate);
    return () => socket.off("client-cursor", handleCursorUpdate);
  }, [socket, fileId]);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

 
    editor.onDidChangeCursorPosition((e) => {
      socket?.emit("cursor-move", {
        fileId,
        position: e.position,
      });
    });


    editor.onDidChangeModelContent((event) => {
      if (isRemoteChange.current) return;

      socket?.emit("edits", {
        fileId,
        changes: event.changes,
      });
    });
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    if (editor._cursorWidgets) {
      editor._cursorWidgets.forEach((w) =>
        editor.removeContentWidget(w)
      );
    }

    editor._cursorWidgets = [];

    Object.entries(userCursors).forEach(([id, { position, username, color }]) => {
      if (!position) return;

      const widget = {
        getId: () => `cursor-${id}`,
        getDomNode: () => {
          const node = document.createElement("div");
          node.textContent = username;
          node.className = "foreign-label";
          node.style.backgroundColor = color;
          return node;
        },
        getPosition: () => ({
          position,
          preference: [
            monaco.editor.ContentWidgetPositionPreference.ABOVE,
          ],
        }),
      };

      editor.addContentWidget(widget);
      editor._cursorWidgets.push(widget);
    });
  }, [userCursors]);

  const handleSave = async () => {
    if (!fileId || !editorRef.current) return;

    try {
      const content = editorRef.current.getValue();

      const res = await axios.put(
        `${SERVER}/file/save/${fileId}`,
        { content },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("File saved!", { autoClose: 1000 });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error saving file");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${SERVER}/file/delete/${fileId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("File deleted", {
          autoClose: 1000,
          onClose: () => window.location.reload(),
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  // Ctrl + S
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fileId]);

  if (!fileId)
    return <div className="no-file">Select a file...</div>;

  return (
    <div className="file-container">
      <Editor
        height="800px"
        className="file-editor"
        language={language}
        theme="vs-dark"
        value={fileContent}
        onMount={handleEditorMount}
        options={{
          readOnly: role === "viewer",
          minimap: { enabled: false },
        }}
      />

      <div className="buttons">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={role === "viewer"}
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          disabled={role === "viewer"}
        >
          Delete
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default File;
