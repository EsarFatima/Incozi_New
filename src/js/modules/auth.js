// src/js/modules/auth.js
// Authentication Module - Manages user authentication

import API from '../api.js';
import { setToStorage, removeFromStorage, getFromStorage } from '../utils.js';

const AuthModule = (() => {
  /**
   * Register new user
   */
  const register = async (firstName, lastName, email, password, role = 'client') => {
    try {
      const response = await API.auth.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
      });

      if (response.token) {
        setToStorage('auth_token', response.token);
        setToStorage('user_id', response.user.id);
        setToStorage('user_role', response.user.role);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const response = await API.auth.login(email, password);

      if (response.token) {
        setToStorage('auth_token', response.token);
        setToStorage('user_id', response.user.id);
        setToStorage('user_role', response.user.role);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await API.auth.logout();
      removeFromStorage('auth_token');
      removeFromStorage('user_id');
      removeFromStorage('user_role');
    } catch (error) {
      console.error('Logout error:', error);
      removeFromStorage('auth_token');
      removeFromStorage('user_id');
      removeFromStorage('user_role');
    }
  };

  /**
   * Verify email
   */
  const verifyEmail = async (token) => {
    try {
      return await API.auth.verifyEmail(token);
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email) => {
    try {
      return await API.auth.resetPassword(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!getFromStorage('auth_token');
  };

  /**
   * Get current user ID
   */
  const getCurrentUserId = () => {
    return getFromStorage('user_id');
  };

  /**
   * Get current user role
   */
  const getCurrentUserRole = () => {
    return getFromStorage('user_role');
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return getCurrentUserRole() === role;
  };

  return {
    register,
    login,
    logout,
    verifyEmail,
    resetPassword,
    isAuthenticated,
    getCurrentUserId,
    getCurrentUserRole,
    hasRole,
  };
})();

export default AuthModule;
