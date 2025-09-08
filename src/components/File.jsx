import { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import axios from "axios";
import "./File.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useCheckAuth } from "../hooks/useAuthCheck";

const File = ({ fileId }) => {
  const [code, setCode] = useState("");
    const checkAuth = useCheckAuth();

    const SERVER = 'https://web-editor-uoxj.onrender.com';
  

  useEffect(() => {
    if (!fileId) return; // No file selected yet
    const fetchFile = async () => {
      const res = await axios.get(`${SERVER}/file/get/${fileId}`,{
        withCredentials: true
      });
      setCode(res.data.file.content);
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
      <h1 className="file-header">Monaco Editor</h1>
      <MonacoEditor
        height="800"
        className={'file-editor'}
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={(newValue) => setCode(newValue)}
      />
      <div className="buttons">
        <button className="save-btn" onClick={handleSave}>save</button>
        <button onClick={handleDelete}>delete</button>
      </div>
     <ToastContainer />

    </div>
  );
};

export default File;