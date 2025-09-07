const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/database');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./src/routes/auth');

// Use routes  
app.use('/api/auth', authRoutes);

app.use('/api/content', require('./src/routes/content'));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Elevare API Updated!',
    timestamp: new Date().toISOString(),
    routes_loaded: true,
    available_endpoints: [
      'GET /',
      'POST /api/auth/register', 
      'POST /api/auth/login'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 UPDATED Elevare API running on port ${PORT}`);
  console.log(`✅ Routes loaded successfully`);
});
