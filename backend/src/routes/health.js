const express = require('express');
const router = express.Router();

// Simple health check endpoint
router.get('/', (req, res) => {
  const healthcheck = {
    status: 'OK',
    uptime: process.uptime(),
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  };
  
  try {
    res.json(healthcheck);
  } catch (error) {
    healthcheck.message = error.message;
    res.status(503).json(healthcheck);
  }
});

module.exports = router;
