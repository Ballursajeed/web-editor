import { useEffect, useState } from "react";
import axios from "axios";
import "./Explorer.css";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { DiJavascript1, DiPython, DiHtml5, DiCss3, DiJava } from "react-icons/di";
import { SiTypescript, SiC, SiCplusplus } from "react-icons/si";
import { VscJson } from "react-icons/vsc";
import { SERVER } from "../constants";

export default function Explorer({ name, projectId, onFileSelect, onFilesSelect, selectedFiles }) {
  const [tree, setTree] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showCreateForm,setShowCreateForm] = useState(false);
  const [type,setType] = useState('');
  const [formName,setFormName] = useState('');

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await axios.get(`${SERVER}/file/tree/${projectId}`,{
          withCredentials: true
        });
        setTree(res.data.tree);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTree();
  }, [projectId]);

  const handleCreateButton = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom });
    setShowMenu(!showMenu);
  };

  const handleOptionClick = (type) => {
    setShowMenu(false);
    setType(String(type));
    setShowCreateForm(true);
    console.log("Creating:", type); 
  };

  const handleFormSubmit = async() => {
    const res = await axios.post(`${SERVER}/file/add`,{
      name:formName,projectId,type, parentId:null
    },{
         withCredentials: true
      });
    if(res.data.success){
      alert(`${type} created successfully!`);
      window.location.reload();
    }
  }
return (
  <div className="explorer">
    <div className="explorer-content">
      <h2 className="explorer-title">
        {name}
        <button className="plus-btn" onClick={handleCreateButton}>+</button>
      </h2>

      <TreeView 
        nodes={tree}
        onFileSelect={onFileSelect}
        onFilesSelect={onFilesSelect}
        selectedFiles={selectedFiles}
      />

      {showMenu && (
        <div
          className="context-menu"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <div className="menu-item" onClick={() => handleOptionClick("file")}>
            New File
          </div>
          <div className="menu-item" onClick={() => handleOptionClick("folder")}>
            New Folder
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="context-menu" style={{ top: menuPosition.y, left: menuPosition.x }}>
          <label htmlFor="create-form">Name</label>
          <input
            style={{ width: "90%" }}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            type="text"
            id="create-form"
          />
          <button onClick={handleFormSubmit}>submit</button>
        </div>
      )}
    </div>

    {/* Fixed bottom area */}
    <div className="live-share">
      <button>Collabe</button>
    </div>

    <div className="exl-profile">
      <div className="exl-profile-avatar">
        {user.username?.charAt(0).toUpperCase()}
      </div>
      <div className="exl-profile-info">
        <span className="exl-profile-name">{user.username}</span>
        <span className="exl-profile-role">Logged in</span>
      </div>
    </div>
  </div>
);
}

function TreeView({ nodes, onFileSelect, onFilesSelect, selectedFiles }) {
  const [openFolders, setOpenFolders] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showCreateForm,setShowCreateForm] = useState(false);
  const [type,setType] = useState('');
  const [formName,setFormName] = useState('');
  const [parentIdState,setParentIdState] = useState('');

const extensionToIcon = {
  js: <DiJavascript1 color="#f7df1e" />,   
  ts: <SiTypescript color="#3178c6" />,    
  py: <DiPython color="#3776ab" />,        
  json: <VscJson color="#cb3837" />,       
  html: <DiHtml5 color="#e34c26" />,      
  css: <DiCss3 color="#264de4" />,         
  java: <DiJava color="#f89820" />,        
  cpp: <SiCplusplus color="#00599c" />,    
  c: <SiC color="#A8B9CC" />,              
};

  const { id } = useParams();

  const toggleFolder = (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

    function getFileIcon(fileName) {
  const ext = fileName.split(".").pop();
  return extensionToIcon[ext] || "📄";
}

  const handleOptionClick = (type) => {
    setShowMenu(false);
    setType(String(type));
    setShowCreateForm(true);
    console.log("Creating:", type); 
  };

  const handleFormSubmit = async() => {
    const res = await axios.post(`${SERVER}/file/add`,{
      name:formName,projectId:id,type, parentId:parentIdState
    },{
         withCredentials: true
      });
    if(res.data.success){
      alert(`${type} created successfully!`);
      setParentIdState('');
      window.location.reload();
    }
  }

  return (
    <ul className="treeview">
      {nodes.map((node) => (
        <li key={node._id} className="tree-item">
          {node.type === "folder" ? (
            <div
              className="tree-row"
              onClick={() => toggleFolder(node._id)}
            >
              <span className="icon">{openFolders[node._id] ? "📂" : "📁"} </span>
              <span className="label">{node.name} <button className="plus-btn" onClick={(e) => {
                 e.stopPropagation();
                const rect = e.target.getBoundingClientRect();
                setMenuPosition({ x: rect.left, y: rect.bottom }); //for new file or new folder UI position
                setShowMenu(!showMenu);
                setParentIdState(node._id);
              }}>+</button></span>
            </div>
          ) : (
            <div
              className="tree-row"
              onClick={() => 
              {
                onFileSelect(node._id);
                const existedFileId = selectedFiles.find((ele)=> ele._id === node._id);
                if(!existedFileId){
                 onFilesSelect([...selectedFiles,{
                  _id:node._id,
                  name: node.name
                 }]);
                }
              }
              }
            >
              <span className="icon">{getFileIcon(node.name)}</span>
              <span className="label">{node.name}</span>
            </div>
          )}
            {showMenu && (
        <div
          className="context-menu"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <div className="menu-item" onClick={() => handleOptionClick("file")}>
            New File
          </div>
          <div className="menu-item" onClick={() => handleOptionClick("folder")}>
            New Folder
          </div>
        </div>
      )}

       {
        showCreateForm && (
          <>
           <div className="context-menu"
           style={{ top: menuPosition.y, left: menuPosition.x }}>
            <label htmlFor="create-form">Name</label>
            <input style={{ width:"90%" }} value={formName} onChange={(e) => setFormName(e.target.value)}  type="text" id="create-form" />
            <button onClick={handleFormSubmit}>submit</button>
           </div>
          </>
        )
      }
          {node.type === "folder" &&
            openFolders[node._id] &&
            node.children?.length > 0 && (
              <TreeView nodes={node.children} onFileSelect={onFileSelect} onFilesSelect={onFilesSelect} selectedFiles={selectedFiles}/>
            )}
        </li>
      ))}
    </ul>
  );
}
