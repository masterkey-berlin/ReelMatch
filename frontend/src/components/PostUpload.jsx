import React, { useState } from 'react';
import apiClient from '../services/api';

function PostUpload({ roomId, userId }) {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return setMessage('Bitte wähle eine Videodatei.');
    setMessage('Uploading...');

    const formData = new FormData();
    formData.append('postVideo', file); // Muss zum Backend passen: upload.single('postVideo')
    formData.append('textContent', textContent);

    try {
      console.log('roomId:', roomId, 'userId:', userId);
      await apiClient.post(`/rooms/${roomId}/users/${userId}/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Post erfolgreich erstellt!');
      window.location.reload(); // Einfachste Methode zur Aktualisierung im MVP
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload fehlgeschlagen.');
    }
  };

  return (
    <div>
      <textarea
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder="Erzähle etwas zu deinem Video..."
      />
      <br />
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Posten</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PostUpload;