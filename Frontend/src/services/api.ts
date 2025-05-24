import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2000', // Make sure this matches your backend port
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      (config.headers as any).token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;