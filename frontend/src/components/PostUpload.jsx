import React, { useState } from 'react';
import apiClient from '../services/api';

// Die Komponente akzeptiert onUploadSuccess, um die Post-Liste neu zu laden
function PostUpload({ roomId, userId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Bitte wähle eine Videodatei.');
      return;
    }
    setIsUploading(true);
    setMessage('Uploading...');

    const formData = new FormData();
    formData.append('postVideo', file);
    formData.append('textContent', textContent);

    try {
      await apiClient.post(`/rooms/${roomId}/users/${userId}/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Post erfolgreich erstellt!');
      
      // Formular zurücksetzen
      setFile(null);
      setTextContent('');
      
      // Eltern-Komponente benachrichtigen, um die Post-Liste neu zu laden
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload fehlgeschlagen.');
    } finally {
      setIsUploading(false);
      // Nachricht nach ein paar Sekunden ausblenden
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      <textarea
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder="Erzähle etwas zu deinem Video..."
        rows="3"
        disabled={isUploading}
      />
      <input 
        type="file" 
        accept="video/*" 
        onChange={(e) => setFile(e.target.files[0])} 
        disabled={isUploading} 
      />
      <button type="submit" disabled={isUploading || !file}>
        {isUploading ? 'Uploading...' : 'Posten'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default PostUpload;