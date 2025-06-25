import API from './api';

export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    // Store token in localStorage (consider more secure storage for production)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async () => {
  try {
    await API.get('/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProtectedData = async () => {
  try {
    const response = await API.get('/protected');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};