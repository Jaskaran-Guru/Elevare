const express = require('express');
const router = express.Router();

// Temporary dummy route for testing
router.post('/generate-content', async (req, res) => {
  try {
    console.log('AI Content request received:', req.body);
    
    const { topic, grade, stream } = req.body;
    
    // Return dummy data for now
    const dummyContent = {
      summary: `This is an AI-generated summary about "${topic}" for ${grade} ${stream} students.`,
      notes: `• Key Point 1 about ${topic}\n• Key Point 2 about the subject\n• Important concepts to remember\n• Practice examples and applications`,
      resources: [
        {
          type: 'video',
          title: `${topic} - Complete Tutorial`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`
        }
      ],
      topics: ['Concept 1', 'Concept 2', 'Key Terms']
    };
    
    res.json({
      success: true,
      content: dummyContent
    });
    
  } catch (error) {
    console.error('AI Content Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
