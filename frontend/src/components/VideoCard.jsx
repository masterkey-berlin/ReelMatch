import React, { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import MatchModal from './MatchModal';
import './VideoCard.css';

const VideoCard = ({ 
  video, 
  videoOwner, 
  roomName, 
  showLikeButton = true,
  onVideoLike 
}) => {
  const { likeVideo } = useMatches();
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [matchModalData, setMatchModalData] = useState(null);
  const [showThumbnail, setShowThumbnail] = useState(true);

  // Debug: Zeige showLikeButton status
  console.log('VideoCard - showLikeButton:', showLikeButton);
  console.log('VideoCard - video:', video);
  console.log('VideoCard - videoOwner:', videoOwner);

  const handleLikeVideo = async () => {
    if (isLiking || hasLiked) return;

    setIsLiking(true);
    try {
      const response = await likeVideo(videoOwner.id, video.id);
      setHasLiked(true);
      
      // Success feedback
      if (response.isMatch) {
        setMatchModalData(response);
      }
      
      // Callback für Parent-Komponente
      if (onVideoLike) {
        onVideoLike(response);
      }
      
    } catch (error) {
      console.error('Error liking video:', error);
      // Reset bei Fehler
      setIsLiking(false);
    }
  };

  const closeMatchModal = () => {
    setMatchModalData(null);
  };

  return (
    <>
      <div className="video-card">
        <div className="video-container">
          <video 
            controls 
            muted
            className="video-player"
            preload="metadata"
            onPlay={() => setShowThumbnail(false)}
            onLoadedMetadata={() => setShowThumbnail(false)}
          >
            <source src={`http://localhost:3001/${(video.path || video.video_path || '').replace(/\\/g, '/')}`} type="video/mp4" />
            Dein Browser unterstützt keine Videos.
          </video>
          
          {showThumbnail && (
            <div className="video-thumbnail-overlay">
              <div className="play-button">
                <div className="play-icon">▶</div>
              </div>
              <div className="video-info-overlay">
                <span className="video-owner-name">{videoOwner.username}</span>
                <span className="video-room-name">{roomName}</span>
              </div>
            </div>
          )}
          
          {showLikeButton && (
            <div className="video-actions">
              <button 
                className={`like-btn ${hasLiked ? 'liked' : ''}`}
                onClick={handleLikeVideo}
                disabled={isLiking || hasLiked}
                title={hasLiked ? 'Video geliked! Interesse gezeigt.' : 'Video liken und Interesse zeigen'}
              >
                {isLiking ? '⏳' : hasLiked ? '💖' : '❤️'}
              </button>
            </div>
          )}
        </div>
        
        <div className="video-info">
          <div className="video-owner">
            <div className="owner-avatar">
              {videoOwner.username[0].toUpperCase()}
            </div>
            <div className="owner-details">
              <span className="owner-name">{videoOwner.username}</span>
              <span className="room-name">📍 {roomName}</span>
            </div>
          </div>
          
          {video.description && (
            <p className="video-description">{video.description}</p>
          )}
          
          <div className="video-meta">
            <span className="timestamp">
              {new Date(video.created_at).toLocaleDateString('de-DE')}
            </span>
            {hasLiked && (
              <span className="like-status">
                ✨ Interesse gezeigt
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Match Modal */}
      <MatchModal 
        match={matchModalData} 
        isOpen={!!matchModalData} 
        onClose={closeMatchModal} 
      />
    </>
  );
};

export default VideoCard;
