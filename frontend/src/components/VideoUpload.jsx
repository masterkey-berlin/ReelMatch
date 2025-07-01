import React, { useState } from 'react';
import apiClient from '../services/api';

function VideoUpload({ userId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    setMessage('Uploading...');

    const formData = new FormData();
    // 'introVideo' muss mit dem Feldnamen in upload.single('introVideo') im Backend übereinstimmen
    formData.append('introVideo', file); 

    try {
      // Axios-Header für multipart/form-data anpassen
      const response = await apiClient.post(`/users/${userId}/intro-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      // Optional: Lade die Seite neu oder aktualisiere den Profilstatus, um das Video anzuzeigen
      window.location.reload(); 
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed.');
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Video</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VideoUpload;