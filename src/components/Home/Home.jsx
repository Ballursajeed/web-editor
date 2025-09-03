import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import './Home.css';
import { useCheckAuth } from '../../hooks/useAuthCheck.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useSelector } from 'react-redux';
import Loading from '../Loader/Loader.jsx';

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
      const res = await axios.post('http://localhost:3000/file/new',{
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

    useEffect(() => {
     const fetchProjects = async() => {
      const res = await axios.get('http://localhost:3000/file/project/user',{
        withCredentials: true
      });
      if(res.data.success){
        setProjects([...projects,...res.data.projects])
      }
     } 
     checkAuth("/login");
     fetchProjects();
  }, []);

  return (
  <>
      <div className="home-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Your Projects</h3>
          {projects.length === 0 ? (
            <p>No projects yet.</p>
          ) : (
            <ul>
              {projects.map((project) => (
                <li
                  key={project._id}
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="project-item"
                >
                  {project.name}
                </li>
              ))}
            </ul>
          )}
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