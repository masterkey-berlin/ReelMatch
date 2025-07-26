import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT Token und User-ID automatisch zu Requests hinzufügen
apiClient.interceptors.request.use(
  (config) => {
    // JWT Token hinzufügen, wenn vorhanden
    const token = localStorage.getItem('reelmatch_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Benutzer-ID aus localStorage für die tempAuthForDev-Middleware hinzufügen
    const user = JSON.parse(localStorage.getItem('reelmatch_user') || '{}');
    if (user && user.id) {
      config.headers['X-User-Id'] = user.id;
      console.log('Adding X-User-Id header:', user.id);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor für Token-Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token ist abgelaufen oder ungültig
      localStorage.removeItem('reelmatch_token');
      localStorage.removeItem('reelmatch_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// NEU: Funktion zum Löschen eines Posts
export const deletePostApi = (roomId, postId, userId) => {
  return apiClient.delete(`/rooms/${roomId}/posts/${postId}`, { 
    data: { userId } 
  });
};

export default apiClient;