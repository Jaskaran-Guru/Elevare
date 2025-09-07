const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/config/database');
const app = express();

// Connect Database
connectDB();

// CORS Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ ENSURE AUTH ROUTES ARE REGISTERED
try {
  const authRoutes = require('./src/routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes registered successfully');
} catch (error) {
  console.error('❌ Failed to load auth routes:', error.message);
  console.log('Creating basic auth routes...');
  
  // Basic auth route fallback
  app.post('/api/auth/login', (req, res) => {
    res.status(501).json({ 
      success: false,
      message: 'Login endpoint not fully implemented yet. Check backend setup.' 
    });
  });
  
  app.post('/api/auth/register', (req, res) => {
    res.status(501).json({ 
      success: false,
      message: 'Register endpoint not fully implemented yet. Check backend setup.' 
    });
  });
}

// Health route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is running',
    routes: {
      health: '/api/health',
      auth_login: '/api/auth/login',
      auth_register: '/api/auth/register'
    }
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Elevare API Running!',
    timestamp: new Date().toISOString(),
    available_endpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register', 
      'POST /api/auth/login'
    ]
  });
});

// Error handling middleware (before 404)
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(err.status || 500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// ✅ CORRECT 404 Handler (always last)
app.use((req, res) => {
  console.log('❌ 404 Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    available_routes: [
      'GET /',
      'GET /api/health', 
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Elevare API running on port ${PORT}`);
  console.log(`✅ Server started successfully`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/health`);
});
