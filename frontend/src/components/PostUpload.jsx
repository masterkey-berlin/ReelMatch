import React, { useState } from 'react';
import apiClient from '../services/api';

// Die Komponente akzeptiert onPostCreated, um die Post-Liste neu zu laden
const PostUpload = ({ roomId, onUploadSuccess }) => {
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
    
    // Überprüfen, ob roomId vorhanden ist
    if (!roomId) {
      console.error('PostUpload: Missing required parameter roomId');
      setMessage('Fehler: Room ID fehlt.');
      return;
    }
    
    console.log('PostUpload: Uploading with roomId:', roomId);
    
    setIsUploading(true);
    setMessage('Uploading...');

    const formData = new FormData();
    formData.append('postVideo', file);
    formData.append('textContent', textContent);

    try {
      console.log(`Uploading post to room ${roomId}`);
      console.log('File being uploaded:', file.name, file.type, file.size);
      
      // API-Anfrage ohne userId im Pfad, da der authentifizierte Benutzer vom Backend verwendet wird
      const response = await apiClient.post(`/rooms/${roomId}/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('Upload response:', response.data);
      setMessage('Post erfolgreich hochgeladen!');
      setIsUploading(false);
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
      setTextContent('');
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