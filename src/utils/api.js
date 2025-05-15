// frontend/src/utils/api.js
import axios from 'axios';
import config from '../config';

// Function to check if the server is alive
export const checkServerHealth = async () => {
  try {
    await axios.get(`${config.get('baseURL')}/api/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
};

const api = axios.create({
  baseURL: config.get('baseURL'),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.get('timeouts')?.request,
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token has expired or is invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;