const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['academic', 'soft-skills', 'career-guidance', 'current-affairs'],
    required: true,
  },
  grade: {
    type: String,
    enum: ['10th', '11th', '12th', 'college', 'graduate', 'all'],
    required: true,
  },
  stream: {
    type: String,
    enum: ['science', 'commerce', 'arts', 'vocational', 'all'],
    default: 'all',
  },
  type: {
    type: String,
    enum: ['video', 'article', 'quiz', 'assignment'],
    required: true,
  },
  content: {
    text: String,
    videoUrl: String,
    duration: Number, // in minutes
    resources: [String],
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  xpReward: {
    type: Number,
    default: 10,
  },
  prerequisites: [String],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Content', contentSchema);
