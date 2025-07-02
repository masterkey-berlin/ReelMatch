import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1', // <-- Jetzt beginnt jeder Request mit /api/
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;