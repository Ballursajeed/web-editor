import React, { useState } from 'react';
import { X } from "lucide-react"; 
import "./selectedFile.css";

const SelectedFiles = ({ selectedFiles, onFileSelect, onFilesSelect }) => {
  const [activeFileId, setActiveFileId] = useState(null);

  const handleSelect = (file) => {
    setActiveFileId(file._id);
    onFileSelect(file._id);
  };

  const handleClose = (e, file) => {
    e.stopPropagation();

    const newFiles = selectedFiles.filter(f => f._id !== file._id);

    onFilesSelect(newFiles);

    if (activeFileId === file._id) {
      if (newFiles.length > 0) {
        onFileSelect(newFiles[newFiles.length - 1]._id); 
        setActiveFileId(newFiles[newFiles.length - 1]._id);
      } else {
        onFileSelect(null);
        setActiveFileId(null);
      }
    }
    
  };

  return (
    <div className="selected-files">
      {selectedFiles.map((file) => (
        <div
          key={file._id}
          className={`tab ${activeFileId === file._id ? "active" : ""}`}
          onClick={() => handleSelect(file)}
        >
          <span className="tab-name">{file.name}</span>
          <button
            className="tab-close"
            onClick={(e) => handleClose(e, file)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedFiles;
