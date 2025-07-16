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
    
    if (!userId) {
      setMessage('Fehler: Benutzer-ID nicht gefunden. Bitte melden Sie sich erneut an.');
      console.error('VideoUpload: No user ID provided');
      return;
    }
    
    setIsUploading(true);
    setMessage('Uploading...');
    console.log(`Uploading video for user ID: ${userId}`);
    console.log('Current user in VideoUpload:', JSON.parse(localStorage.getItem('reelmatch_user') || '{}'));

    const formData = new FormData();
    formData.append('introVideo', file);

    try {
      console.log('Request URL:', `/users/${userId}/intro-video`);
      console.log('File being uploaded:', file.name, file.type, file.size);
      
      const response = await apiClient.post(`/users/${userId}/intro-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload response:', response.data);
      setMessage(response.data.message || 'Upload erfolgreich!');
      
      // Rufe die übergebene Funktion auf, um die Eltern-Komponente zu benachrichtigen
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error('Video upload error:', error);
      console.error('Error response:', error.response?.data);
      setMessage(error.response?.data?.message || 'Upload fehlgeschlagen. Bitte versuchen Sie es später erneut.');
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