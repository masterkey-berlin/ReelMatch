import React from 'react';
import { useParams } from 'react-router-dom';
import VideoUpload from './VideoUpload';

function Profile() {
  const { userId } = useParams();

  return (
    <div>
      <h2>Your Profile (User ID: {userId})</h2>
      {/* Profilinhalte werden in Phase 4 hier angezeigt */}
      <hr />
      <h3>Upload Your Intro Video</h3>
      <VideoUpload userId={userId} />
    </div>
  );
}

export default Profile;