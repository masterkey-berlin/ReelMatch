import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1', // <-- Jetzt beginnt jeder Request mit /api/
  headers: {
    'Content-Type': 'application/json',
  },
});

// NEU: Funktion zum Löschen eines Posts
export const deletePostApi = (roomId, postId, userId) => {
  return apiClient.delete(`/rooms/${roomId}/posts/${postId}`, { 
    data: { userId } 
  });
};

export default apiClient;