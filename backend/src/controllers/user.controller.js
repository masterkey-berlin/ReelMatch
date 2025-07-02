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

// Neue Funktion für das User-Profil
export const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    // Wir brauchen eine neue Model-Funktion dafür
    const user = await UserModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Wichtig: Passwort-Hash niemals senden!
    const { hashed_password, ...profileData } = user;
    res.status(200).json(profileData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error retrieving user profile.' });
  }
};

// Hier die neue Funktion einfügen:
export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { short_bio } = req.body;

  if (short_bio === undefined) {
    return res.status(400).json({ message: 'short_bio is required in the request body.' });
  }

  try {
    const updateData = { short_bio };
    const updatedUser = await UserModel.updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { hashed_password, ...profileData } = updatedUser;
    res.status(200).json({ message: 'Profile updated successfully.', user: profileData });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating user profile.' });
  }
};