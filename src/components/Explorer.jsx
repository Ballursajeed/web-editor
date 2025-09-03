import { useEffect, useState } from "react";
import axios from "axios";
import "./Explorer.css";
import { useParams } from "react-router";

export default function Explorer({ name, projectId, onFileSelect }) {
  const [tree, setTree] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showCreateForm,setShowCreateForm] = useState(false);
  const [type,setType] = useState('');
  const [formName,setFormName] = useState('');

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await axios.get(`https://web-editor-uoxj.onrender.com/file/tree/${projectId}`,{
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
    const res = await axios.post('https://web-editor-uoxj.onrender.com/file/add',{
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
      <h2 className="explorer-title">
        {name}
        <button className="plus-btn" onClick={handleCreateButton}>+</button>
      </h2>

      <TreeView nodes={tree} onFileSelect={onFileSelect} />

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
    </div>
  );
}

function TreeView({ nodes, onFileSelect }) {
  const [openFolders, setOpenFolders] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showCreateForm,setShowCreateForm] = useState(false);
  const [type,setType] = useState('');
  const [formName,setFormName] = useState('');
  const [parentIdState,setParentIdState] = useState('');

  const { id } = useParams();

  const toggleFolder = (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  
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
    const res = await axios.post('https://web-editor-uoxj.onrender.com/file/add',{
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
                setMenuPosition({ x: rect.left, y: rect.bottom });
                setShowMenu(!showMenu);
                setParentIdState(node._id);
              }}>+</button></span>
            </div>
          ) : (
            <div
              className="tree-row"
              onClick={() => onFileSelect(node._id)}
            >
              <span className="icon">📄</span>
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
              <TreeView nodes={node.children} onFileSelect={onFileSelect} />
            )}
        </li>
      ))}
    </ul>
  );
}
