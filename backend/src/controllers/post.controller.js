import * as PostModel from '../models/post.model.js'; // Stelle sicher, dass dieser Import da ist

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

// NEU: Controller-Funktion zum Löschen
export const deletePostController = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    // Finde den Post und prüfe die Berechtigung
    const post = await PostModel.findPostById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own posts.' });
    }

    // Lösche den Post
    const deletedPost = await PostModel.deletePost(postId, userId);
    if (!deletedPost) {
      return res.status(500).json({ message: 'Failed to delete post.' });
    }

    res.status(200).json({ message: 'Post successfully deleted.' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};