import { useState } from 'react';
import axios from 'axios';
import { User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/users/login', credentials);
      setUser(response.data.user);
      return response.data.user;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/users/logout');
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users/me');
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, logout, checkAuth };
};