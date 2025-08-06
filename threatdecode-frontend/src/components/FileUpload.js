import React, { useState, useRef } from 'react';
import { Upload, Image, AlertCircle } from 'lucide-react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    onFileUpload(file);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload-container">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${isAnalyzing ? 'analyzing' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {isAnalyzing ? (
          <div className="upload-content">
            <div className="loading-spinner"></div>
            <h3>Analyzing QR Code...</h3>
            <p>Please wait while we process your image</p>
          </div>
        ) : (
          <div className="upload-content">
            <Upload size={48} className="upload-icon" />
            <h3>Upload QR Code Image</h3>
            <p>
              Drag & drop an image here, or <span className="click-text">click to browse</span>
            </p>
            <div className="file-info">
              <Image size={16} />
              <span>Supports: JPEG, PNG, GIF, WebP (Max 10MB)</span>
            </div>
          </div>
        )}
      </div>

      {selectedFile && !isAnalyzing && (
        <div className="selected-file">
          <AlertCircle size={16} />
          <span>Selected: {selectedFile.name}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
