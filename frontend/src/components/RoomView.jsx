import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import PostUpload from './PostUpload'; // Angenommen, PostUpload ist eine eigene Komponente
import styles from './RoomView.module.css';

function RoomView() {
  const { roomId } = useParams();
  const [posts, setPosts] = useState([]);
  const [roomName, setRoomName] = useState(''); // Um den Raumnamen anzuzeigen
  const [loading, setLoading] = useState(true);
  // Im MVP setzen wir die userId statisch, in einer echten App käme sie aus dem Login-State
  const currentUserId = 1; 

  const fetchPosts = async () => {
    try {
      // Wir könnten hier auch eine Route für Raumdetails erstellen,
      // aber für jetzt holen wir nur die Posts.
      const response = await apiClient.get(`/rooms/${roomId}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Hier könntest du auch den Raumnamen holen, wenn die API das unterstützt
    // z.B. setRoomName( fetchedRoomData.name )
    fetchPosts();
  }, [roomId]);

  if (loading) return <p className="card text-center">Lade Posts...</p>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Beiträge im Raum "{roomName || `Raum ${roomId}`}"</h2>

      {/* "Neuen Post erstellen"-Bereich in einer eigenen Karte */}
      <div className={`${styles.newPostSection} card`}>
        <h3>Neuen Post erstellen</h3>
        <PostUpload roomId={roomId} userId={currentUserId} onUploadSuccess={fetchPosts} />
      </div>

      <h3>Bestehende Posts</h3>
      <div className={styles.postsList}>
        {posts.length > 0 ? (
          posts.map(post => (
            // Jeder Post ist eine eigene Karte
            <div key={post.post_id} className={`card ${styles.postCard}`}>
              <div className={styles.postHeader}>
                <div className={styles.postAvatar}>{post.username.charAt(0).toUpperCase()}</div>
                <div>
                  <div className={styles.postAuthor}>{post.username}</div>
                  <div className={styles.postTimestamp}>
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              {post.text_content && <p className={styles.postContent}>{post.text_content}</p>}
              {post.video_path && (
                 <video className={styles.postVideo} controls>
                   <source src={`http://localhost:3001/${post.video_path.replace(/\\/g, '/')}`} type="video/mp4" />
                 </video>
              )}
            </div>
          ))
        ) : (
          <p>Noch keine Posts in diesem Raum. Sei der/die Erste!</p>
        )}
      </div>
    </div>
  );
}

export default RoomView;