import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import VideoUpload from './VideoUpload';
import styles from './Profile.module.css';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Debug: Zeige user info
  console.log('Profile - Current user:', user);
  console.log('Profile - User ID:', user?.id);

  // Funktion zum Abrufen der Profildaten
  const fetchProfile = useCallback(async () => {
    try {
      // Wenn userId nicht vorhanden ist, eigenes Profil laden
      const profileId = userId || (user ? user.id : null);
      
      console.log('Fetching profile for user ID:', profileId);
      
      if (!profileId) {
        setError('Kein Benutzer gefunden. Bitte melden Sie sich an.');
        return;
      }
      
      const response = await apiClient.get(`/users/${profileId}/profile`);
      console.log('Profile data received:', response.data);
      setProfile(response.data);
      setBio(response.data.short_bio || ''); // Bio-State initial setzen
    } catch (err) {
      setError('Could not fetch profile.');
      console.error('Error fetching profile:', err);
    }
  }, [userId, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Funktion zum Speichern der Bio
  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/users/${userId}/profile`, { short_bio: bio });
      // Profil neu laden, um die Änderungen zu sehen
      fetchProfile(); 
      setIsEditingBio(false); // Bearbeitungsmodus beenden
    } catch (err) {
      console.error('Failed to update bio', err);
    }
  };

  // Wird aufgerufen, wenn der Video-Upload erfolgreich war
  const onUploadSuccess = () => {
    fetchProfile(); // Lädt die Profildaten neu, um das neue Video anzuzeigen
  };

  if (error) return <p className="card text-center">{error}</p>;
  if (!profile) return <p className="card text-center">Loading profile...</p>;

  return (
    <div>
      <div className="card">
        <div className={styles.profileLayout}>
          {/* Video-Spalte */}
          <div className={styles.videoWrapper}>
            {profile.profile_video_path ? (
              <video key={profile.profile_video_path} className={styles.profileVideo} controls>
                <source src={`/${profile.profile_video_path.replace(/\\/g, '/')}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className={styles.noVideoPlaceholder}>
                <p>Kein Video-Intro vorhanden</p>
              </div>
            )}
          </div>

          {/* Info-Spalte */}
          <div className={styles.profileInfo}>
            <h2 className={styles.username}>{profile.username}'s Profil</h2>
            
            <div className={styles.bioSection}>
              <p className="text-muted">Bio:</p>
              {isEditingBio ? (
                <form onSubmit={handleBioSubmit} className={styles.editBioForm}>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="3"
                  />
                  <button type="submit">Speichern</button>
                </form>
              ) : (
                <p onClick={() => setIsEditingBio(true)} style={{cursor: 'pointer'}}>
                  {profile.short_bio || 'Klicke hier, um eine Bio hinzuzufügen...'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.uploadSection} card`} style={{marginTop: '2rem'}}>
        <h3>Video-Intro hochladen / aktualisieren</h3>
        <VideoUpload userId={user?.id} onUploadSuccess={onUploadSuccess} />
      </div>

      {user && user.id == userId && (
        <p style={{ color: 'limegreen' }}>Das ist dein eigenes Profil!</p>
      )}
    </div>
  );
}

export default Profile;