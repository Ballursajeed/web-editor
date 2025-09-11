import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Explorer from '../Explorer';
import File from '../File';
import axios from 'axios';
import { SERVER } from '../../constants';
import SelectedFiles from '../selectedFiles/SelectedFiles';

const Project = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles,setSelectedFiles] = useState([]);
  const [name,setName] = useState('');
  const { id } = useParams(); 

  useEffect(() => {
      const fetchProject = async() => {
        const res = await axios.get(`${SERVER}/file/project/get/${id}`,{
          withCredentials: true
        });
        if(res.data.success){
            setName(res.data.project.name);
        }
      }
      fetchProject();
  },[]);

  

  return (
   <div className="app-container">
      <Explorer name={name} 
      projectId={id} 
      onFileSelect={setSelectedFile} 
      onFilesSelect={setSelectedFiles}
      selectedFiles={selectedFiles}
      />

      <div className='right-container'>
        <SelectedFiles selectedFiles={selectedFiles} onFilesSelect={setSelectedFiles}  onFileSelect={setSelectedFile} />
        <File fileId={selectedFile} />
      </div>
     </div>
  )
}

export default Project