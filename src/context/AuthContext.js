import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnection, setWsConnection] = useState(null);
  const navigate = useNavigate();

  // Initialize API token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // WebSocket connection management
  const setupWebSocket = useCallback((token) => {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const ws = new WebSocket(`${protocol}${window.location.hostname}:5000/ws`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Authenticate WebSocket connection
      ws.send(JSON.stringify({
        type: 'auth',
        token: token
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch(message.type) {
        case 'auth_expired':
          toast.error('Session expired. Please login again.');
          logout();
          break;
        case 'force_logout':
          toast.error('You have been logged out from another device.');
          logout();
          break;
        case 'session_update':
          // Handle session updates if needed
          break;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWsConnection(ws);
    return ws;
  }, [logout]);

  const loadUserFromToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      
      // Verify token expiration
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }

      // Verify with backend
      const response = await API.get('/auth/me');
      setUser(response.data);
      
      // Setup WebSocket after successful auth
      setupWebSocket(token);
    } catch (err) {
      console.error('Auth verification failed:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, [setupWebSocket]);

  useEffect(() => {
    loadUserFromToken();

    return () => {
      // Cleanup WebSocket on unmount
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [loadUserFromToken]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      // Setup WebSocket after registration
      setupWebSocket(token);
      
      toast.success(`Welcome ${user.name}!`);
      
      // Redirect based on role
      if (user.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
      
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  }, [navigate, setupWebSocket]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      // Setup WebSocket after login
      setupWebSocket(token);
      
      toast.success(`Welcome back ${user.name}!`);
      
      // Redirect based on role
      if (user.role === 'teacher') {
        navigate('/teacher');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
      
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  }, [navigate, setupWebSocket]);

  const logout = useCallback(async () => {
    try {
      if (wsConnection) {
        wsConnection.close();
        setWsConnection(null);
      }
      
      await API.get('/auth/logout');
      localStorage.removeItem('token');
      delete API.defaults.headers.common['Authorization'];
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Logout failed. Please try again.');
    }
  }, [navigate, wsConnection]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    login,
    register,
    logout,
    wsConnection // Optionally expose WebSocket connection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};