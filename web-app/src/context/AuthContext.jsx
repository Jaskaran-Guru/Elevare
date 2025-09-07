import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You can verify token here or decode it
      // For now, we'll assume valid token means logged in
      setUser({ token });
    }
  }, []);

  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('AuthContext register called with:', userData);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          grade: userData.grade,
          stream: userData.stream || 'science'
        }),
      });

      const data = await response.json();
      console.log('Register API response:', response.status, data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

const login = async (credentials) => {
  setLoading(true);
  try {
    console.log('AuthContext login called with:', credentials);
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });

    console.log('Response status:', response.status);
    
    // ✅ Handle different response statuses
    if (response.status === 404) {
      throw new Error('Login endpoint not found. Check if backend server is running on port 5000.');
    }
    
    if (response.status === 501) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login functionality not implemented yet.');
    }
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.log('Could not parse error response as JSON');
      }
      throw new Error(errorMessage);
    }

    // ✅ Safe JSON parsing
    const responseText = await response.text();
    console.log('Response text length:', responseText.length);
    
    if (!responseText) {
      throw new Error('Empty response from server');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response text was:', responseText);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
    }

    console.log('Parsed login data:', data);

    if (data.success !== false && data.token) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } else {
      throw new Error(data.message || 'Login failed - no token received');
    }

  } catch (error) {
    console.error('Login error in AuthContext:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};



  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
