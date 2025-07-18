import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import PostUpload from './PostUpload'; // Angenommen, PostUpload ist eine eigene Komponente
import VideoCard from './VideoCard'; // Import für VideoCard hinzufügen
import styles from './RoomView.module.css';
import { useAuth } from '../context/AuthContext';

function RoomView() {
  const { roomId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Debug: Zeige user info
  console.log('RoomView - Current user:', user);
  console.log('RoomView - User ID:', user?.user_id);
  
  // Wir verwenden nur die tatsächliche Benutzer-ID ohne Fallback
  const currentUserId = user?.user_id;
  
  // Debug: Zeige die verwendete Benutzer-ID
  console.log('RoomView - Using user ID for posts:', currentUserId);

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

  // Die Löschfunktion wurde in die VideoCard-Komponente verschoben

  // NEU: Handle-Funktion für Video-Likes in Räumen
  const handleVideoLike = (likeResponse) => {
    if (likeResponse.isMatch) {
      console.log('It\'s a match!', likeResponse);
      // Match-Modal wird automatisch durch VideoCard angezeigt
    }
  };

  if (loading) return <p className="card text-center">Lade Posts...</p>;

  return (
    <div>
      <h2 className={styles.pageTitle}>Beiträge im Raum "{`Raum ${roomId}`}"</h2>

      {/* "Neuen Post erstellen"-Bereich in einer eigenen Karte */}
      <div className={`${styles.newPostSection} card`}>
        <h3>Neuen Post erstellen</h3>
        <PostUpload roomId={roomId} onUploadSuccess={fetchPosts} />
      </div>

      <h3>Bestehende Posts</h3>
      <div className={styles.postsList}>
        {posts.length > 0 ? (
          posts.map(post => (
            // Jeder Post ist eine eigene Karte
            <div key={post.id} className={`card ${styles.postCard}`}>
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
                <VideoCard
                  video={{
                    id: post.id,
                    path: post.video_path,
                    title: post.text_content || `Video in Raum ${roomId}`,
                    description: post.text_content,
                    created_at: post.created_at
                  }}
                  videoOwner={{
                    id: post.user_id,
                    username: post.username
                  }}
                  roomName={`Raum ${roomId}`}
                  showLikeButton={currentUserId !== post.user_id} // Eigene Videos nicht liken
                  onVideoLike={handleVideoLike}
                  onVideoDelete={fetchPosts} // Füge den onVideoDelete-Callback hinzu
                />
              )}
              {/* Delete-Button wurde in die VideoCard-Komponente verschoben */}
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