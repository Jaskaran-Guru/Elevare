const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Progress Sub-Schema for AI interactions and learning progress
const ProgressSchema = new mongoose.Schema({
  contentId: {
    type: String, // Can be ObjectId or custom string for AI content
    required: true
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  score: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  
  // ✅ AI Resources Data Storage
  aiResourcesGenerated: {
    type: Boolean,
    default: false
  },
  aiResourcesData: {
    type: mongoose.Schema.Types.Mixed // Store complete AI response
  }
}, { timestamps: true });

// Learning Statistics Sub-Schema
const LearningStatsSchema = new mongoose.Schema({
  totalXP: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  modulesCompleted: {
    type: Number,
    default: 0
  },
  totalStudyTime: {
    type: Number, // in minutes
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
});

// Main User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  grade: {
    type: String,
    required: true,
    enum: ['10th', '11th', '12th', 'graduate', 'all']
  },
  stream: {
    type: String,
    required: true,
    enum: ['science', 'commerce', 'arts', 'all']
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  
  // ✅ COMPLETE USER ACTIVITY TRACKING
  progress: [ProgressSchema], // All learning progress
  
  learningStats: {
    type: LearningStatsSchema,
    default: () => ({}) // Initialize with default values
  },
  
  // ✅ AI Interaction History
  aiInteractions: [{
    topic: String,
    subject: String,
    difficulty: String,
    resourcesGenerated: {
      type: Date,
      default: Date.now
    },
    userRating: Number, // 1-5 stars for AI content quality
    feedback: String
  }],
  
  // Profile Info
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ CRITICAL: Method to Update Progress (Working Version)
// ✅ BULLETPROOF updateProgress method
UserSchema.methods.updateProgress = function(contentId, progressData) {
  console.log('🔧 updateProgress called with:', { contentId, progressData });
  
  const existingIndex = this.progress.findIndex(p => 
    p.contentId && p.contentId.toString() === contentId.toString()
  );
  
  if (existingIndex >= 0) {
    console.log('📝 Updating existing progress at index:', existingIndex);
    // Update existing - use Object.assign to properly merge
    Object.assign(this.progress[existingIndex], progressData);
    this.progress[existingIndex].lastAccessedAt = new Date();
  } else {
    console.log('➕ Adding new progress entry');
    // Add new entry
    this.progress.push({
      contentId,
      ...progressData,
      lastAccessedAt: new Date()
    });
  }
  
  // ✅ CRITICAL: Mark as modified for nested arrays
  this.markModified('progress');
  
  // Update stats
  this.updateLearningStats();
  this.markModified('learningStats');
  
  console.log('💾 Saving user document...');
  
  // ✅ CRITICAL: Return save promise
  return this.save().then(savedUser => {
    console.log('✅ User saved successfully!');
    return savedUser;
  }).catch(error => {
    console.error('❌ Save failed:', error);
    throw error;
  });
};

// Method to update learning statistics
UserSchema.methods.updateLearningStats = function() {
  const completedModules = this.progress.filter(p => p.status === 'completed').length;
  const totalScore = this.progress.reduce((sum, p) => sum + (p.score || 0), 0);
  const totalTime = this.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  
  this.learningStats.modulesCompleted = completedModules;
  this.learningStats.totalXP = totalScore;
  this.learningStats.totalStudyTime = totalTime;
  this.learningStats.averageScore = this.progress.length > 0 ? totalScore / this.progress.length : 0;
  this.learningStats.lastActiveDate = new Date();
};

// ✅ Method to Add AI Interaction
UserSchema.methods.addAIInteraction = function(interactionData) {
  this.aiInteractions.push({
    topic: interactionData.topic,
    subject: interactionData.subject,
    difficulty: interactionData.difficulty,
    resourcesGenerated: new Date(),
    userRating: interactionData.userRating || null,
    feedback: interactionData.feedback || ''
  });
  
  // Keep only last 50 AI interactions
  if (this.aiInteractions.length > 50) {
    this.aiInteractions = this.aiInteractions.slice(-50);
  }
  
  return this.save();
};

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
UserSchema.methods.checkPassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
