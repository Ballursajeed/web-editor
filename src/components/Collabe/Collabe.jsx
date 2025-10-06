import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Explorer from '../Explorer';
import File from '../File';
import axios from 'axios';
import { SERVER } from '../../constants';
import SelectedFiles from '../selectedFiles/SelectedFiles';
import { io } from 'socket.io-client';

const Collabe = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles,setSelectedFiles] = useState([]);

  const [name,setName] = useState('');
  const [id,setId] = useState('');
  const [role,setRole] = useState('editor')
  const { session } = useParams(); 

  const [socket,setSocket] = useState(null);

  useEffect(() => {
      const fetchProject = async() => {
        const res = await axios.get(`${SERVER}/file/project/collabe/${session}`,{
          withCredentials: true
        });
        if(res.data.success){
            setName(res.data.project.name);
            setId(res.data.project._id);
            setRole(res.data.role);
        }
      }
      fetchProject();
  },[]);

  useEffect(() => {

    const s = io(SERVER,{
      withCredentials: true
    });

    s.on('connect',() => {
        console.log("user is connected: ",s.id);
        s.emit('join-session',{sessionId: session})
    });

    s.on("disconnect",() => {
      console.log("client is disconnected!",s.id);
    });

     setSocket(s);

    return () => {
    s.disconnect();
  };

  },[session])

  return (
   <div className="app-container">
    {id && name ? (   
      <Explorer 
        name={name} 
        projectId={id} 
        onFileSelect={setSelectedFile} 
        onFilesSelect={setSelectedFiles}
        selectedFiles={selectedFiles}
      />
    ) : (
      <p>Loading project...</p>
    )}

      <div className='right-container'>
        <SelectedFiles selectedFiles={selectedFiles} onFilesSelect={setSelectedFiles}  onFileSelect={setSelectedFile} />
        <File role={role} fileId={selectedFile} socket={socket} />
      </div>
     </div>
  )
}

export default Collabe