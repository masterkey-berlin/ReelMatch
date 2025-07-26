import React, { useState, useEffect } from 'react';
import { useMatches } from '../hooks/useMatches';
import apiClient from '../services/api';
import './SwipeInterface.css';

const SwipeInterface = ({ onMatch }) => {
  const { expressInterest } = useMatches();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIntroThumbnail, setShowIntroThumbnail] = useState(true);
  const [showPostThumbnails, setShowPostThumbnails] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Laden der Benutzer vom Backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Ì¥ç Fetching swipe users...');
        // Zuerst versuchen wir, die Benutzer vom Backend zu laden
        try {
          const response = await apiClient.get('/users/swipe');
          if (response.data && response.data.length > 0) {
            setUsers(response.data);
            console.log('‚úÖ Swipe users loaded from API:', response.data);
            return;
          }
        } catch (error) {
          console.warn('‚ö†Ô∏è API endpoint not available:', error.message);
          console.warn('‚ö†Ô∏è Falling back to mock data');
        }
        
        // Mock-Daten mit echten Video-Pfaden von der EC2-Instanz
        console.log('Ì≤° Using mock swipe data with real EC2 video paths');
        setUsers([
          {
            id: 1,
            username: 'sarah_cool',
            bio: 'Liebe Comedy und Action-Filme!',
            age: 25,
            introVideo: '/uploads/introVideo-1753378520383-338249915.mp4',
            recentPosts: [
              {
                video: '/uploads/postVideo-1753378550691-411377911.mp4',
                room: 'Comedy-Klassiker',
                timestamp: '2 Stunden her'
              }
            ],
            interests: ['Comedy', 'Action', 'Reisen']
          },
          {
            id: 2,
            username: 'mike_movie',
            bio: 'Sci-Fi Fan und Hobby-Regisseur',
            age: 28,
            introVideo: '/uploads/introVideo-1753378888288-287865616.mp4',
            recentPosts: [
              {
                video: '/uploads/postVideo-1753378865678-935874321.mp4',
                room: 'Sci-Fi Universum',
                timestamp: '1 Tag her'
              },
              {
                video: '/uploads/postVideo-1753380171148-903305031.mp4',
                room: 'Filmproduktion',
                timestamp: '3 Tage her'
              }
            ],
            interests: ['Sci-Fi', 'Filmproduktion', 'Gaming']
          },
          {
            id: 3,
            username: 'anna_artist',
            bio: 'Indie-Filme und Kunsthaus-Kino',
            age: 24,
            introVideo: '/uploads/introVideo-1753378520383-338249915.mp4',
            recentPosts: [
              {
                video: '/uploads/postVideo-1753380194863-357863291.mp4',
                room: 'Indie & Arthouse',
                timestamp: '5 Stunden her'
              }
            ],
            interests: ['Indie-Filme', 'Kunst', 'Fotografie']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = async (direction, userId) => {
    if (isProcessing) return;

    setIsProcessing(true);

    if (direction === 'right') {
      try {
        console.log(`ÌæØ Expressing interest for user ${userId}`);
        const response = await expressInterest(userId);
        console.log('‚úÖ Interest response:', response);

        if (response.isMatch && onMatch) {
          onMatch({
            ...response,
            matchedUser: currentUserData,
            matchId: response.match.match_id
          });
        }
      } catch (error) {
        console.error('‚ùå Fehler beim Swipen:', error);
        setErrorMessage('Fehler beim Swipen: ' + error.message);
      }
    } else {
      console.log(`Ì±é Skipping user ${userId}`);
    }

    // Zum n√§chsten User wechseln
    setCurrentIndex(prev => (prev + 1) % users.length);
    setIsProcessing(false);
  };

  const currentUserData = users[currentIndex];

  if (loading) {
    return (
      <div className="swipe-interface">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Lade potenzielle Matches...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="swipe-interface">
        <div className="error">
          <h3>Fehler</h3>
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!currentUserData) {
    return (
      <div className="swipe-interface">
        <div className="no-more-users">
          <h3>Keine weiteren Profile</h3>
          <p>Du hast alle verf√ºgbaren Profile gesehen!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swipe-interface">
      <div className="video-profile-card">
        {/* Intro Video Section */}
        <div className="intro-video-section">
          <h3>Intro Video</h3>
          <div className="video-container">
            {currentUserData.introVideo ? (
              <>
                <video 
                  key={currentUserData.introVideo}
                  controls 
                  muted
                  className="intro-video"
                  preload="metadata"
                  onPlay={() => setShowIntroThumbnail(false)}
                  onLoadedMetadata={() => setShowIntroThumbnail(false)}
                >
                  <source src={currentUserData.introVideo} type="video/mp4" />
                  Dein Browser unterst√ºtzt keine Videos.
                </video>
                
                {showIntroThumbnail && (
                  <div className="video-thumbnail-overlay">
                    <div className="play-button">
                      <div className="play-icon">‚ñ∂</div>
                    </div>
                    <div className="video-info-overlay">
                      <h3>{currentUserData.username}</h3>
                      <p>Intro Video</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-video-placeholder">
                <p>Kein Intro-Video verf√ºgbar</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info Section */}
        <div className="user-info-section">
          <h2>{currentUserData.username}, {currentUserData.age}</h2>
          <p className="bio">{currentUserData.bio}</p>
          
          <div className="interests-section">
            <h4>Interessen:</h4>
            <div className="interests-tags">
              {currentUserData.interests.map((interest, index) => (
                <span key={index} className="interest-tag">{interest}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="recent-posts-section">
          <h3>Letzte Posts</h3>
          <div className="posts-grid">
            {currentUserData.recentPosts.map((post, index) => (
              <div key={index} className="post-item">
                <div className="post-video-container">
                  {post.video ? (
                    <>
                      <video 
                        controls 
                        muted
                        className="post-video"
                        preload="metadata"
                        onPlay={() => setShowPostThumbnails(prev => ({ ...prev, [index]: false }))}
                        onLoadedMetadata={() => setShowPostThumbnails(prev => ({ ...prev, [index]: false }))}
                      >
                        <source src={post.video} type="video/mp4" />
                      </video>
                      
                      {showPostThumbnails[index] !== false && (
                        <div className="video-thumbnail-overlay post-thumbnail">
                          <div className="play-button small">
                            <div className="play-icon">‚ñ∂</div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-video-placeholder small">
                      <p>Kein Video</p>
                    </div>
                  )}
                </div>
                <div className="post-info">
                  <span className="room-name">{post.room}</span>
                  <span className="timestamp">{post.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Swipe Buttons */}
        <div className="swipe-buttons">
          <button 
            className="swipe-button reject" 
            onClick={() => handleSwipe('left', currentUserData.id)}
            disabled={isProcessing}
          >
            Nicht interessiert
          </button>
          <button 
            className="swipe-button like" 
            onClick={() => handleSwipe('right', currentUserData.id)}
            disabled={isProcessing}
          >
            Interesse zeigen
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeInterface;
