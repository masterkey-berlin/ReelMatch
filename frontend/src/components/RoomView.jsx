import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient, { deletePostApi } from '../services/api'; // NEU: Import hinzufügen
import PostUpload from './PostUpload'; // Angenommen, PostUpload ist eine eigene Komponente
import styles from './RoomView.module.css';
import { useAuth } from '../context/AuthContext';

function RoomView() {
  const { roomId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const currentUserId = user && user.user_id ? user.user_id : null; // Im MVP setzen wir die userId statisch, in einer echten App käme sie aus dem Login-State

  const fetchPosts = useCallback(async () => {
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
  }, [roomId]);

  useEffect(() => {
    // Hier könntest du auch den Raumnamen holen, wenn die API das unterstützt
    fetchPosts();
  }, [roomId, fetchPosts]);

  // NEU: Handle-Funktion für das Löschen
  const handleDeletePost = async (postIdToDelete) => {
    if (!postIdToDelete) {
      alert('Fehler: Post-ID ist nicht vorhanden!');
      return;
    }

    if (window.confirm('Bist du sicher, dass du diesen Post löschen möchtest?')) {
      try {
        await deletePostApi(roomId, postIdToDelete, user?.user_id);
        fetchPosts(); // Liste neu laden
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Löschen fehlgeschlagen. Du kannst nur deine eigenen Posts löschen.');
      }
    }
  };

  if (loading) return <p className="card text-center">Lade Posts...</p>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Beiträge im Raum "{`Raum ${roomId}`}"</h2>

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
              {/* NEU: Delete-Button nur für eigene Posts */}
              {user?.user_id === post.user_id && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className={styles.deleteButton}
                >
                  Löschen
                </button>
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