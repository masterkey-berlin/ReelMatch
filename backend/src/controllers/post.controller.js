import * as PostModel from '../models/post.model.js';

export const createVideoPost = async (req, res) => {
  const { userId, roomId } = req.params;
  const { textContent } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded.' });
  }
  const videoPath = req.file.path;

  try {
    const newPost = await PostModel.createPost({ userId, roomId, videoPath, textContent });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating new post.' });
  }
};