import * as RoomModel from '../models/room.model.js';
import * as PostModel from '../models/post.model.js';

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.findAllRooms();
    res.status(200).json(rooms);
  } catch {
    res.status(500).json({ message: 'Error fetching rooms.' });
  }
};

export const getPostsInRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const posts = await PostModel.findPostsByRoomId(roomId);
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: 'Error fetching posts for this room.' });
  }
};
