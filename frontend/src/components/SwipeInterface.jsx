import React, { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import './SwipeInterface.css';

const SwipeInterface = ({ onMatch }) => {
  const { expressInterest } = useMatches();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showIntroThumbnail, setShowIntroThumbnail] = useState(true);
  const [showPostThumbnails, setShowPostThumbnails] = useState({});

  // Mock-Daten für Demo-Zwecke - Video-basierte Profile
  const [users] = useState([
    {
      id: 2,
      username: 'sarah_cool',
      bio: 'Liebe Comedy und Action-Filme! ',
      age: 25,
      introVideo: '/uploads/introVideo-1752439602224-521957059.mp4',
      recentPosts: [
        {
          video: '/uploads/postVideo-1752439291512-790499454.mp4',
          room: 'Comedy-Klassiker',
          timestamp: '2 Stunden her'
        }
      ],
      interests: ['Comedy', 'Action', 'Reisen']
    },
    {
      id: 3,
      username: 'mike_movie',
      bio: 'Sci-Fi Fan und Hobby-Regisseur ',
      age: 28,
      introVideo: '/uploads/introVideo-1752482317936-170159145.mp4',
      recentPosts: [
        {
          video: '/uploads/postVideo-1752439580980-399548449.mp4',
          room: 'Sci-Fi Universum',
          timestamp: '1 Tag her'
        },
        {
          video: '/uploads/postVideo-1752482072458-731791990.mp4',
          room: 'Filmproduktion',
          timestamp: '3 Tage her'
        }
      ],
      interests: ['Sci-Fi', 'Filmproduktion', 'Gaming']
    },
    {
      id: 4,
      username: 'anna_artist',
      bio: 'Indie-Filme und Kunsthaus-Kino ',
      age: 24,
      introVideo: '/uploads/introVideo-1752439602224-521957059.mp4',
      recentPosts: [
        {
          video: '/uploads/postVideo-1752482249594-799512553.mp4',
          room: 'Indie & Arthouse',
          timestamp: '5 Stunden her'
        }
      ],
      interests: ['Indie-Filme', 'Kunst', 'Fotografie']
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = async (direction, userId) => {
    if (isProcessing) return;

    setIsProcessing(true);

    if (direction === 'right') {
      try {
        const response = await expressInterest(userId);
        
        if (response.isMatch && onMatch) {
          onMatch(response);
        }
      } catch (error) {
        console.error('Fehler beim Swipen:', error);
      }
    }

    // Zum nächsten User wechseln
    setCurrentIndex(prev => (prev + 1) % users.length);
    setIsProcessing(false);
  };

  const currentUserData = users[currentIndex];

  if (!currentUserData) {
    return (
      <div className="swipe-interface">
        <div className="no-more-users">
          <h3>Keine weiteren User verfügbar</h3>
          <p>Schaue später wieder vorbei!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swipe-interface">
      <div className="video-profile-card">
        {/* Intro Video Section */}
        <div className="intro-video-section">
          <h3> Intro Video</h3>
          <div className="video-container">
            <video 
              key={currentUserData.introVideo}
              controls 
              muted
              className="intro-video"
              preload="metadata"
              onPlay={() => setShowIntroThumbnail(false)}
              onLoadedMetadata={() => setShowIntroThumbnail(false)}
            >
              <source src={`http://localhost:3001${currentUserData.introVideo}`} type="video/mp4" />
              Dein Browser unterstützt keine Videos.
            </video>
            
            {showIntroThumbnail && (
              <div className="video-thumbnail-overlay">
                <div className="play-button">
                  <div className="play-icon">▶</div>
                </div>
                <div className="video-info-overlay">
                  <span className="video-owner-name">{currentUserData.username}</span>
                  <span className="video-room-name">Intro Video</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="user-info">
          <h2>{currentUserData.username}</h2>
          <p className="age">Alter: {currentUserData.age}</p>
          <p className="bio">{currentUserData.bio}</p>
          
          <div className="interests">
            {currentUserData.interests.map((interest, index) => (
              <span key={index} className="interest-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="recent-posts-section">
          <h3> Letzte Posts</h3>
          <div className="posts-grid">
            {currentUserData.recentPosts.map((post, index) => (
              <div key={index} className="post-item">
                <div className="post-video-container">
                  <video 
                    controls 
                    muted
                    className="post-video"
                    preload="metadata"
                    onPlay={() => setShowPostThumbnails(prev => ({ ...prev, [index]: false }))}
                    onLoadedMetadata={() => setShowPostThumbnails(prev => ({ ...prev, [index]: false }))}
                  >
                    <source src={`http://localhost:3001${post.video}`} type="video/mp4" />
                  </video>
                  
                  {showPostThumbnails[index] !== false && (
                    <div className="video-thumbnail-overlay post-thumbnail">
                      <div className="play-button small">
                        <div className="play-icon">▶</div>
                      </div>
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
        
        {/* Action Buttons */}
        <div className="swipe-buttons">
          <button 
            className="swipe-btn reject"
            onClick={() => handleSwipe('left', currentUserData.id)}
            disabled={isProcessing}
          >
            Nicht interessiert
          </button>
          <button 
            className="swipe-btn like"
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
