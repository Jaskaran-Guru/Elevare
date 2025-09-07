const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/database');
const app = express();

// Connect Database
connectDB();

// ✅ CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));

// ✅ EXPRESS 5.x SPLAT PARAMETER FIX: Named wildcard
app.options('/*splat', cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
  next();
});

// Import routes
const authRoutes = require('./src/routes/auth');

const aiContentRoutes = require('./src/routes/aiContent');

// Import progress routes
const progressRoutes = require('./src/routes/progress');

// Register progress routes
app.use('/api/progress', progressRoutes);

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiContentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Express 5.x compatible server with splat parameter',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Elevare API - Express 5.x with Splat Fix',
    endpoints: [
      'POST /api/ai/generate-learning-resources',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
});

// ✅ EXPRESS 5.x SPLAT PARAMETER FIX: Catch-all with named wildcard
app.use('/*splat', (req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.originalUrl);
  console.log('📝 Splat parameter:', req.params.splat);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Express 5.x Server with Splat Parameter running on port ${PORT}`);
  console.log(`✅ CORS enabled for localhost:3000, localhost:5173`);
  console.log(`🎯 Using /*splat syntax for Express 5.x compatibility`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/health`);
});
