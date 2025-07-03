import React, { useState } from 'react';
import apiClient from '../services/api';

// Die Komponente akzeptiert jetzt eine onUploadSuccess-Funktion als Prop
function VideoUpload({ userId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Bitte wähle eine Datei aus.');
      return;
    }
    setIsUploading(true);
    setMessage('Uploading...');

    const formData = new FormData();
    formData.append('introVideo', file);

    try {
      const response = await apiClient.post(`/users/${userId}/intro-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      
      // Rufe die übergebene Funktion auf, um die Eltern-Komponente zu benachrichtigen
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload fehlgeschlagen.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} disabled={isUploading} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </button>
      {message && <p style={{marginTop: '1rem'}}>{message}</p>}
    </div>
  );
}

export default VideoUpload;