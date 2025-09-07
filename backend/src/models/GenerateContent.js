const mongoose = require('mongoose');

const generatedContentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  grade: String,
  stream: String,
  topic: String,
  subject: String,
  content: {
    summary: String,
    notes: String,
    resources: [{
      type: String,  // 'video' or 'article'
      title: String,
      url: String
    }],
    topics: [String]
  },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeneratedContent', generatedContentSchema);
