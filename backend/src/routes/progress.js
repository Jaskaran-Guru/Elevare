const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Update user progress for any content/module
// ✅ Enhanced progress update route with debugging
router.post('/update', async (req, res) => {
  try {
    console.log('📊 Progress update request received:', req.body);
    
    const { userId, contentId, status, completionPercentage, score, timeSpent, aiResourcesData } = req.body;
    
    if (!userId || !contentId) {
      return res.status(400).json({
        success: false,
        error: 'userId and contentId are required'
      });
    }
    
    console.log('🔍 Finding user:', userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    console.log('👤 User found:', user.name);
    console.log('📋 Current progress entries:', user.progress.length);
    
    // ✅ CRITICAL: Await the updateProgress method
    const updatedUser = await user.updateProgress(contentId, {
      status: status || 'in_progress',
      completionPercentage: completionPercentage || 0,
      score: score || 0,
      timeSpent: timeSpent || 0,
      aiResourcesGenerated: !!aiResourcesData,
      aiResourcesData
    });
    
    console.log('✅ Progress updated! New progress count:', updatedUser.progress.length);
    console.log('📈 Updated stats:', updatedUser.learningStats);
    
    res.json({
      success: true,
      message: 'Progress updated successfully',
      user: {
        progress: updatedUser.progress,
        learningStats: updatedUser.learningStats
      }
    });
    
  } catch (error) {
    console.error('❌ Progress update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update progress',
      message: error.message
    });
  }
});


// Get user's complete progress data
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        progress: user.progress,
        learningStats: user.learningStats,
        aiInteractions: user.aiInteractions?.slice(-10) || [], // Last 10 AI interactions
        totalXP: user.learningStats?.totalXP || 0
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress'
    });
  }
});

// ✅ NEW: Add AI Interaction tracking
router.post('/ai-interaction', async (req, res) => {
  try {
    const { userId, topic, subject, difficulty, userRating, feedback } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Add AI interaction using model method
    await user.addAIInteraction({
      topic,
      subject,
      difficulty,
      userRating,
      feedback
    });
    
    res.json({
      success: true,
      message: 'AI interaction tracked successfully'
    });
    
  } catch (error) {
    console.error('❌ Error tracking AI interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track AI interaction'
    });
  }
});

// ✅ NEW: Mark content as completed
router.post('/complete', async (req, res) => {
  try {
    const { userId, contentId, finalScore, totalTimeSpent } = req.body;
    
    if (!userId || !contentId) {
      return res.status(400).json({
        success: false,
        error: 'userId and contentId are required'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Mark as completed with final stats
    const updatedUser = await user.updateProgress(contentId, {
      status: 'completed',
      completionPercentage: 100,
      score: finalScore || 25,
      timeSpent: totalTimeSpent || 30,
      completedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Content marked as completed!',
      xpEarned: finalScore || 25,
      user: {
        progress: updatedUser.progress,
        learningStats: updatedUser.learningStats
      }
    });
    
  } catch (error) {
    console.error('❌ Error completing content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete content'
    });
  }
});

module.exports = router;
