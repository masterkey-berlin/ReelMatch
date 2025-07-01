import * as PostModel from '../models/post.model.js';

export const createVideoPost = async (req, res) => {
  const { userId, roomId } = req.params;
  const { textContent } = req.body;

  // NEU: Validierung
  if (!userId || isNaN(Number(userId)) || !roomId || isNaN(Number(roomId))) {
    return res.status(400).json({ message: 'userId und roomId müssen gesetzt und Zahlen sein!' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded.' });
  }
  const videoPath = req.file.path;

  try {
    const newPost = await PostModel.createPost({
      userId: Number(userId),
      roomId: Number(roomId),
      videoPath,
      textContent,
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating new post.' });
  }
};