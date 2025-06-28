import axios from 'axios';
import Cookies from 'js-cookie';


const api = axios.create({
  baseURL:  import.meta.env.VITE_API_URL||'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    console.error('API error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
      response: error.response?.data,
    });
    return Promise.reject(new Error(errorMessage));
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    const { token } = response.data;
    if (token) {
      
      Cookies.set('accessToken', token, { sameSite: 'lax' });
      window.dispatchEvent(new Event('authChange'));
    } else {
      console.warn('No token received from login response');
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserFeedback = async () => {
  try {
    const response = await api.get('/api/feedback');
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    
    Cookies.remove('accessToken');
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/api/feedback', feedbackData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const saveFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/api/feedback', feedbackData);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const deleteFeedback = async (feedbackId) => {
  try {
    console.log('Deleting feedback with ID:', feedbackId);
    const response = await api.delete(`/api/feedback/${feedbackId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
