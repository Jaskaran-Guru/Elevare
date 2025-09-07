const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/database');
const app = express();

// Connect Database
connectDB();

// ✅ EXPRESS 5.x COMPATIBLE CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',    // Create React App
    'http://localhost:5173',    // Vite dev server
    'http://localhost:3001',    // Alternative ports
    'http://127.0.0.1:3000',    // Alternative localhost format
    'http://127.0.0.1:5173'     // Alternative Vite format
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Length'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// ✅ EXPRESS 5.x FIX: Named wildcard for preflight OPTIONS requests
app.options('/*splat', cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url} from origin: ${req.headers.origin || 'no-origin'}`);
  next();
});

// Import routes
const authRoutes = require('./src/routes/auth');
const aiContentRoutes = require('./src/routes/aiContent');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiContentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Express 5.x Server Running with Fixed CORS',
    cors: {
      allowedOrigins: corsOptions.origin,
      requestOrigin: req.headers.origin
    },
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Elevare API - Express 5.x Compatible',
    version: 'Express 5.x with named wildcards',
    corsStatus: 'Fixed for all localhost ports',
    endpoints: [
      'POST /api/ai/generate-learning-resources',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
});

// ✅ EXPRESS 5.x FIX: Named wildcard for 404 handler
app.use('/*splat', (req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/ai/generate-learning-resources'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Express 5.x Compatible Elevare API running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for all localhost ports (3000, 5173, etc.)`);
  console.log(`✅ Named wildcards fix applied for Express 5.x compatibility`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/health`);
});
