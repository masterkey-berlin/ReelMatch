import React, { useState, useRef } from 'react';
import { useMatches } from '../hooks/useMatches';
import MatchModal from './MatchModal';
import './VideoCard.css';
import { useAuth } from '../context/AuthContext';
import { deletePostApi } from '../services/api';

const VideoCard = ({ 
  video, 
  videoOwner, 
  roomName, 
  showLikeButton = true,
  onVideoLike,
  onVideoDelete
}) => {
  const { likeVideo } = useMatches();
  const { user } = useAuth(); // <--- Aktuellen User holen
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [matchModalData, setMatchModalData] = useState(null);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const deleteButtonRef = useRef(null);

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
        // Kombiniere die Server-Antwort mit den vollständigen Benutzerdaten des Video-Owners
        setMatchModalData({ 
          ...response, 
          matchedUser: videoOwner 
        });
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

  // Funktion zum Löschen eines Videos
  const handleDeleteVideo = async () => {
    if (isDeleting) return;
    
    // Button sofort deaktivieren, um mehrfache Klicks zu verhindern
    setIsDeleting(true);
    
    try {
      // Extrahiere die roomId aus dem roomName (Format: "Raum {roomId}")
      // Debug-Ausgabe für den Raumnamen
      console.log('Lösche Video - roomName:', roomName);
      
      // Verschiedene Formate unterstützen: "Raum 123", "Raum123", "123"
      let roomId = null;
      
      // Versuch 1: Format "Raum 123"
      const roomIdMatch1 = roomName.match(/Raum\s+(\d+)/);
      if (roomIdMatch1) {
        roomId = roomIdMatch1[1];
      } else {
        // Versuch 2: Format "Raum123"
        const roomIdMatch2 = roomName.match(/Raum(\d+)/);
        if (roomIdMatch2) {
          roomId = roomIdMatch2[1];
        } else {
          // Versuch 3: Nur Zahlen
          const roomIdMatch3 = roomName.match(/(\d+)/);
          if (roomIdMatch3) {
            roomId = roomIdMatch3[1];
          }
        }
      }
      
      if (!roomId) {
        console.error('Konnte keine Room-ID aus dem Raumnamen extrahieren:', roomName);
        setIsDeleting(false);
        return;
      }
      
      console.log(`Lösche Video ${video.id} in Raum ${roomId}...`);
      
      // Stelle sicher, dass wir die userId haben
      if (!user || (!user.id && !user.user_id)) {
        console.error('Kein Benutzer gefunden oder keine Benutzer-ID vorhanden');
        setIsDeleting(false);
        return;
      }
      
      // Verwende user.user_id oder user.id als userId
      const userId = user.user_id || user.id;
      console.log('Verwende userId für Löschvorgang:', userId);
      
      // Verwende die spezialisierte deletePostApi-Funktion
      const response = await deletePostApi(roomId, video.id, userId);
      console.log('Delete API Response:', response);
      
      console.log(`Video ${video.id} erfolgreich gelöscht!`, response);
      
      // Bestätigungsdialog schließen
      setShowConfirmation(false);
      
      // Callback aufrufen, um die UI zu aktualisieren
      if (onVideoDelete) {
        onVideoDelete();
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Videos:', error);
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  // Prüfen, ob das Video dem angemeldeten User gehört
  // Debug-Ausgabe für die Benutzer-IDs
  console.log('VideoCard - Current user:', user);
  console.log('VideoCard - Video owner:', videoOwner);
  
  // Vergleiche user.id oder user.user_id mit videoOwner.id
  const isOwnVideo = user && videoOwner && 
    ((user.user_id && user.user_id === videoOwner.id) || 
     (user.id && user.id === videoOwner.id));

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
          {/* Like-Button unten rechts im weißen Feld, nur bei fremden Videos */}
          {!isOwnVideo && showLikeButton && (
            <div className="like-btn-row">
              <button 
                className={`like-btn-circle ${hasLiked ? 'liked' : ''}`}
                onClick={handleLikeVideo}
                disabled={isLiking || hasLiked}
                title={hasLiked ? 'Video geliked! Interesse gezeigt.' : 'Video liken und Interesse zeigen'}
              >
                {isLiking ? '⏳' : '❤️'}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Löschen-Button unterhalb der Card, nur für eigene Videos */}
      {isOwnVideo && (
        <div className="delete-btn-row">
          {showConfirmation ? (
            <div className="delete-confirmation">
              <p>Video wirklich löschen?</p>
              <div className="confirmation-buttons">
                <button 
                  className="confirm-btn yes"
                  onClick={handleDeleteVideo}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Wird gelöscht...' : 'Ja'}
                </button>
                <button 
                  className="confirm-btn no"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isDeleting}
                >
                  Nein
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="delete-btn-rect"
              onClick={() => setShowConfirmation(true)}
              disabled={isDeleting}
              ref={deleteButtonRef}
            >
              Löschen
            </button>
          )}
        </div>
      )}

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
