import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import VideoUpload from './VideoUpload';

function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get(`/users/${userId}/profile`);
        setProfile(response.data);
      } catch (err) {
        setError('Could not fetch profile.');
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]); // Effekt erneut ausführen, wenn sich userId ändert

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2>{profile.username}'s Profile</h2>
      {profile.profile_video_path ? (
        <div>
          <h3>Your Intro Video:</h3>
          <video width="320" height="240" controls>
            {/* Die URL muss zur Backend-Route passen, die statische Dateien bereitstellt */}
            <source src={`http://localhost:3001/${profile.profile_video_path.replace(/\\/g, '/')}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <p>You have not uploaded an intro video yet.</p>
      )}
      <p>Bio: {profile.short_bio || 'No bio set.'}</p>
      <hr />
      <h3>Upload/Update Your Intro Video</h3>
      <VideoUpload userId={userId} />
    </div>
  );
}

export default Profile;