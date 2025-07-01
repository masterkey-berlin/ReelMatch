import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api/v1', // URL deines Backends
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;