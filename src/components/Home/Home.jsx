import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import './Home.css';
import { useCheckAuth } from '../../hooks/useAuthCheck.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useSelector } from 'react-redux';
import Loading from '../Loader/Loader.jsx';
import { FiEdit2, FiTrash2 } from "react-icons/fi"; 
import { SERVER } from '../../constants.js';


const Home = () => {

     const [name, setName] = useState('');
     const [loading, setLoading] = useState(false); 
     const [projects,setProjects] = useState([]);
     const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);
    const checkAuth = useCheckAuth();


   const handleSubmit = async() => {
      setLoading(true);

     try {
      const res = await axios.post(`${SERVER}/file/new`,{
         name
      },{
         withCredentials: true
      });
      if(res.data.success){
         console.log(res.data);
         toast.success('Project created Successfully!', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {  
            navigate(`/project/${res.data.project._id}`);
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
     finally {
        setLoading(false);
       }
   }

   const handleDelete = async (id) => {
    
  try {
    const res = await axios.delete(
      `${SERVER}/file/project/${id}`,
      { withCredentials: true }
    );
    console.log(res);
    
    if (res.data.success) {
      toast.success("Project deleted!", { autoClose: 1000 });
      setProjects(projects.filter((p) => p._id !== id));
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Delete failed!");
  }
};

const handleUpdate = async (id) => {
  const newName = prompt("Enter new project name:");
  if (!newName) return;

  try {
    const res = await axios.put(
      `${SERVER}/file/project/${id}`,
      { name: newName },
      { withCredentials: true }
    );
    if (res.data.success) {
      toast.success("Project updated!", { autoClose: 1000 });
      setProjects(
        projects.map((p) =>
          p._id === id ? { ...p, name: newName } : p
        )
      );
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Update failed!");
  }
};

    useEffect(() => {
      setLoading(true);
     const fetchProjects = async() => {
      const res = await axios.get(`${SERVER}/file/project/user`,{
        withCredentials: true
      });
      if(res.data.success){
        setLoading(false);
        setProjects([...projects,...res.data.projects])
      }
     } 
     checkAuth("/login");
     fetchProjects();
     setLoading(false);  
  }, []);

  return (
  <>
      <div className="home-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Your Projects</h3>
          <div className="projects">
            {projects.length === 0 ? (
            <p>No projects yet.</p>
          ) : (
       <ul>
  {projects.map((project) => (
    <li key={project._id} className="project-item" onClick={() => navigate(`/project/${project._id}`)}>
      <span >
        {project.name}
      </span>
      <div className="modify">
        <FiEdit2
          className="icon-btn edit-icon"
          onClick={(e) => { 
            e.stopPropagation();
            handleUpdate(project._id)}
        }
          title="Edit Project"
        />
        <FiTrash2
          className="icon-btn delete-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(project._id)
          }
        }
          title="Delete Project"
        />
      </div>
    </li>
  ))}
</ul>
          )}
          </div>
        
        <div className="profile">
  <div className="profile-avatar">
    {user.username?.charAt(0).toUpperCase()}
  </div>
  <div className="profile-info">
    <span className="profile-name">{user.username}</span>
    <span className="profile-role">Logged in</span>
  </div>
</div>
        </aside>

        {/* Main content */}
        <main className="main-content">
          <h2>Welcome to web editor</h2>
          <h3>Create a new Project</h3>
          <label htmlFor="name-id">Name of the Project: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name-id"
          />
          <br />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Submit"}
          </button>
          <ToastContainer />
        </main>
      </div>
    </>
  )
}

export default Home