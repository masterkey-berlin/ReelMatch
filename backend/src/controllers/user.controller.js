import * as UserModel from '../models/user.model.js';

export const uploadIntroVideo = async (req, res) => {
  const { userId } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded.' });
  }

  // Der Pfad, unter dem die Datei gespeichert wurde.
  // In einer echten App wäre das eher eine URL zu einem S3-Bucket.
  const videoPath = req.file.path; 

  try {
    const updatedUser = await UserModel.updateUserVideoPath(userId, videoPath);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Video uploaded successfully.', user: updatedUser });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ message: 'Error updating user profile with video.' });
  }
};