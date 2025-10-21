import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./File.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCheckAuth } from "../hooks/useAuthCheck";
import { SERVER } from "../constants";

const File = ({ fileId, role, socket }) => {
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [userCursors, setUserCursors] = useState({});

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationIds = useRef([]);

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

  // ⬇️ Fetch file
  useEffect(() => {
    if (!fileId) return;
    const fetchFile = async () => {
      const res = await axios.get(`${SERVER}/file/get/${fileId}`, {
        withCredentials: true,
      });
      const file = res.data.file;
      setCode(file.content);
      setFileName(file.name);

      const ext = file.name.split(".").pop();
      setLanguage(extensionToLang[ext] || "plaintext");
    };
    fetchFile();
  }, [fileId]);

  useEffect(() => {
    checkAuth("/login");
  }, []);

  // ⬇️ Handle remote edits
  useEffect(() => {
    if (!socket) return;

    const handler = (res) => {
      if (String(res.fileId) === fileId && res.sender !== socket.id) {
        setCode(res.code);
      }
    };

    socket.on("client-edit", handler);
    return () => socket.off("client-edit", handler);
  }, [socket, fileId]);

  // ⬇️ When editor mounts
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Track your cursor
    editor.onDidChangeCursorPosition((e) => {
  socket.emit("cursor-move", {
    fileId,
    position: e.position,
  });
});

    // Track your edits
    editor.onDidChangeModelContent(() => {
      socket.emit("edits", { fileId, code: editor.getValue() });
    });
  };

  // ⬇️ Listen for other users’ cursors
  useEffect(() => {
    if (!socket) return;

    const handleCursorUpdate = (data) => {
      if (data.fileId !== fileId) return;

      setUserCursors((prev) => ({
        ...prev,
        [data.username]: {
          position: data.position,
          color: data.color || "#ff4d4d",
          username: data.username,
        },
      }));
    };

    socket.on("client-cursor", handleCursorUpdate);
    return () => socket.off("client-cursor", handleCursorUpdate);
  }, [socket, fileId]);

  // ⬇️ Draw all foreign cursors
useEffect(() => {
  const editor = editorRef.current;
  const monaco = monacoRef.current;
  if (!editor || !monaco) return;

  // Remove previous widgets (if any)
  if (editor._cursorWidgets) {
    editor._cursorWidgets.forEach((id) => editor.removeContentWidget(id));
  }
  editor._cursorWidgets = [];

  // Add one widget per user
  Object.entries(userCursors).forEach(([id, { position, username, color }]) => {
    if (!position) return;

    const widgetId = { getId: () => `cursor-widget-${id}` };
    const domNode = document.createElement("div");
    domNode.textContent = username;
    domNode.className = "foreign-label";
    domNode.style.backgroundColor = color || "#ff4081";

    widgetId.getDomNode = () => domNode;
    widgetId.getPosition = () => ({
      position,
      preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE],
    });

    editor.addContentWidget(widgetId);
    editor._cursorWidgets.push(widgetId);
  });
}, [userCursors]);

  // ⬇️ Save & delete handlers
  const handleSave = async () => {
    if (!fileId) return;
    try {
      const res = await axios.put(
        `${SERVER}/file/save/${fileId}`,
        { content: code },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("File saved successfully!", { autoClose: 1000 });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${SERVER}/file/delete/${fileId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("File deleted successfully!", {
          autoClose: 1000,
          onClose: () => window.location.reload(),
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  // ⌨️ Ctrl + S
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [code, fileId]);

  if (!fileId) return <div className="no-file">Select a file to edit...</div>;

  return (
    <div className="file-container">
      <Editor
        key={language}
        height="800px"
        className="file-editor"
        language={language}
        theme="vs-dark"
        value={code}
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
          save
        </button>
        <button onClick={handleDelete} disabled={role === "viewer"}>
          delete
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default File;
