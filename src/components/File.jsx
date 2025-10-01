import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "./File.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useCheckAuth } from "../hooks/useAuthCheck";
import { SERVER } from "../constants";
import SelectedFiles from "./selectedFiles/SelectedFiles";

      
const File = ({ fileId,role }) => {
    const [code, setCode] = useState("");
    const [fileName,setFileName] = useState('');
    const [language, setLanguage] = useState("plaintext");

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
    if (!fileId) return; 
    const fetchFile = async () => {
      const res = await axios.get(`${SERVER}/file/get/${fileId}`,{
        withCredentials: true
      });
      
      const file = res.data.file;

      setCode(res.data.file.content);
      setFileName(res.data.file.name);

      const ext = file.name.split(".").pop();
      setLanguage(extensionToLang[ext] || "plaintext");

    };
    fetchFile();
  }, [fileId]);


  useEffect(() => {
    checkAuth("/login");
  }, []);

  const handleSave = async () => {
    if (!fileId) return;
   try {
    const res = await axios.put(`${SERVER}/file/save/${fileId}`, { content: code },{
          withCredentials: true
       });
       if(res.data.success){
         toast.success('File saved Successfully!', {
                  position: "top-center",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                
              })
       }
   } catch (error) {
    toast.error(
              `${error?.response?.data?.message || "Something went wrong!"}`,
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
   }
  };

  const handleDelete = async() => {
       try {
        
        const res = await axios.delete(`${SERVER}/file/delete/${fileId}`,{
          withCredentials:true
        });

        if(res.data.success){
          toast.success('File deleted Successfully!', {
                  position: "top-center",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  onClose: () => {  
                    window.location.reload();
                }
              })
        }

       } catch (error) {
        toast.error(
              `${error?.response?.data?.message || "Something went wrong!"}`,
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
       }
  }

  const onChangeHandler = (newValue) => {
       setCode(newValue)
  }

  // Ctrl+S listener
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
        className={'file-editor'}
        language={language}
        theme="vs-dark"
        value={code}
        onChange={role === 'editor' ? onChangeHandler : null}
        options={{
    readOnly: role === "viewer",   
    minimap: { enabled: false },  
  }}
      />
      <div className="buttons">
        <button className="save-btn" 
         onClick={handleSave}
         disabled={role === "viewer"}
        >save</button>
        <button 
         onClick={handleDelete}
         disabled={role === "viewer"} 
         >delete</button>
      </div>
     <ToastContainer />

    </div>
  );
};

export default File;