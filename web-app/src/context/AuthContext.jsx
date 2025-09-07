import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      // Initialize progress if not exists
      const userWithProgress = {
        ...action.payload.user,
        progress: action.payload.user.progress || {
          totalXP: 0,
          modulesCompleted: 0,
          currentStreak: 0
        }
      };
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userWithProgress));
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: userWithProgress,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { ...state, isAuthenticated: false, user: null, token: null };
    case 'UPDATE_PROGRESS':
      const updatedUser = {
        ...state.user,
        progress: {
          ...state.user.progress,
          ...action.payload
        }
      };
      // Save updated user to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        ...state,
        user: updatedUser
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  });

  // Check for existing user data on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Initialize progress if not exists
        if (!parsedUser.progress) {
          parsedUser.progress = {
            totalXP: 0,
            modulesCompleted: 0,
            currentStreak: 0
          };
        }
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: parsedUser, token } 
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // ✅ NEW: Update user progress function
  const updateProgress = (progressData) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: progressData });
  };

  // ✅ NEW: Earn XP function
  const earnXP = (xpAmount, moduleName = '') => {
    if (!state.user) {
      console.warn('Cannot earn XP: User not logged in');
      return;
    }

    const currentProgress = state.user.progress || { totalXP: 0, modulesCompleted: 0, currentStreak: 0 };
    
    const newProgress = {
      totalXP: currentProgress.totalXP + xpAmount,
      modulesCompleted: currentProgress.modulesCompleted + 1,
      currentStreak: currentProgress.currentStreak + 1
    };

    updateProgress(newProgress);

    console.log(`🏆 Earned ${xpAmount} XP! Total: ${newProgress.totalXP} XP`);
    
    // Optional: Show level up notification
    const currentLevel = Math.floor(currentProgress.totalXP / 100) + 1;
    const newLevel = Math.floor(newProgress.totalXP / 100) + 1;
    
    if (newLevel > currentLevel) {
      console.log(`🎉 LEVEL UP! You are now Level ${newLevel}!`);
    }
  };

  // ✅ NEW: Get user level function
  const getUserLevel = () => {
    if (!state.user?.progress?.totalXP) return 1;
    return Math.floor(state.user.progress.totalXP / 100) + 1;
  };

  // ✅ NEW: Get XP progress in current level
  const getLevelProgress = () => {
    if (!state.user?.progress?.totalXP) return 0;
    return state.user.progress.totalXP % 100;
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    updateProgress,
    earnXP,
    getUserLevel,
    getLevelProgress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
