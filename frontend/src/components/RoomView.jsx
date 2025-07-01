import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import PostUpload from './PostUpload';

function RoomView() {
  const { roomId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Im MVP setzen wir die userId statisch, in einer echten App käme sie aus dem Login-State
  const currentUserId = 1; 

  useEffect(() => {
    apiClient.get(`/rooms/${roomId}/posts`)
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, [roomId]);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      <h2>Posts im Raum (ID: {roomId})</h2>
      <hr />
      <h3>Neuen Post erstellen</h3>
      <PostUpload roomId={roomId} userId={currentUserId} />
      <hr />
      <h3>Bestehende Posts</h3>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p><strong>Gepostet von:</strong> {post.username}</p>
            {post.text_content && <p>{post.text_content}</p>}
            <video width="320" height="240" controls>
              <source src={`http://localhost:3001/${post.video_path.replace(/\\/g, '/')}`} type="video/mp4" />
            </video>
          </div>
        ))
      ) : (
        <p>Noch keine Posts in diesem Raum. Sei der Erste!</p>
      )}
    </div>
  );
}

export default RoomView;