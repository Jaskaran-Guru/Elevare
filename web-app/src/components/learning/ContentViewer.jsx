import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, CheckCircle, Award, Clock, BookOpen, User, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext'; // ✅ ADD
import { useGamification } from '../../context/GamificationContext'; // ✅ ADD
import { useAnalytics } from '../../context/AnalyticsContext'; // ✅ ADD
import toast from 'react-hot-toast';

const ContentViewer = () => {
  const { contentId } = useParams();
  const { user, earnXP } = useAuth();
  const { notifyCourseComplete, notifyAchievement } = useNotifications(); // ✅ ADD
  const { recordActivity } = useGamification(); // ✅ ADD
  const { trackContentEngagement } = useAnalytics(); // ✅ ADD
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sample content data
  const sampleContent = {
    _id: contentId,
    title: "Introduction to Physics - Motion",
    description: "Learn the basics of motion, velocity, and acceleration. Perfect for 11th grade science students.",
    category: "physics",
    grade: "11th",
    stream: "science",
    type: "video",
    difficulty: "beginner",
    xpReward: 15,
    content: {
      duration: 15,
      text: `## Introduction to Motion

Motion is fundamental to physics and describes the change in position of an object with respect to time.

### Key Concepts:

**Velocity**: Speed with direction - a vector quantity that tells us how fast something moves and in what direction.

**Acceleration**: The rate of change of velocity over time. When you press the gas pedal in a car, you're creating acceleration.

**Displacement**: The change in position of an object. Unlike distance, displacement considers direction.

### Types of Motion:

1. **Linear Motion**: Movement in a straight line (like a car on a highway)
2. **Rotational Motion**: Movement around an axis (like a spinning wheel)  
3. **Oscillatory Motion**: Back and forth movement (like a pendulum)
4. **Random Motion**: Unpredictable movement (like gas particles)

### Real-World Applications:

Understanding motion helps us design safer cars, predict planetary orbits, and create better sports equipment. From rockets to roller coasters, motion physics is everywhere!

### Practice Questions:

1. If a car travels 100m in 10 seconds, what is its average speed?
2. What type of motion does a pendulum exhibit?
3. How is velocity different from speed?

Remember: Motion is relative! An object at rest relative to one observer might be moving relative to another.`
    },
    progress: null
  };

  useEffect(() => {
    setContent(sampleContent);
    // Record that user started viewing content
    recordActivity('content_started', {
      contentId: contentId,
      category: sampleContent.category
    });
  }, [contentId]);

  useEffect(() => {
    let interval;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        setProgress(prev => {
          const newProgress = Math.min(prev + (100 / (content?.content.duration * 60)), 100);
          if (newProgress >= 100) {
            setIsCompleted(true);
            setIsPlaying(false);
            handleCompletion();
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, content]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.success('Learning session started!');
      recordActivity('learning_session_started', {
        contentId: content._id,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleCompletion = () => {
    setIsCompleted(true);
    
    // ✅ COMPREHENSIVE COMPLETION TRACKING
    earnXP(content.xpReward, content.title);
    
    // Record gamification activity
    recordActivity('course_completed', {
      courseId: content._id,
      xpEarned: content.xpReward,
      category: content.category,
      timeSpent: timeSpent,
      completionPercentage: 100
    });

    // Track analytics engagement
    trackContentEngagement(
      content._id,
      timeSpent / 60, // minutes
      100 // completion percentage
    );

    // Send notifications
    notifyCourseComplete(content.title, content.xpReward);
    
    // Check for level up
    const currentXP = user?.progress?.totalXP || 0;
    const currentLevel = Math.floor(currentXP / 100) + 1;
    const newLevel = Math.floor((currentXP + content.xpReward) / 100) + 1;
    
    if (newLevel > currentLevel) {
      setTimeout(() => {
        notifyAchievement({
          title: `Level Up! You're now Level ${newLevel}! 🚀`,
          xp: 10 // bonus XP for leveling up
        });
      }, 2000);
    }

    // Check for time-based achievements
    if (timeSpent < content.content.duration * 30) { // Completed in under half the expected time
      setTimeout(() => {
        notifyAchievement({
          title: 'Speed Learner! ⚡',
          xp: 5
        });
      }, 3000);
    }

    toast.success(
      `🎉 Congratulations! You've completed "${content.title}" and earned ${content.xpReward} XP!`,
      { duration: 6000 }
    );
  };

  const handleMarkComplete = () => {
    setProgress(100);
    setIsCompleted(true);
    handleCompletion();
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                to="/learning"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Learning
              </Link>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  content.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  content.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {content.difficulty}
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{content.content.duration} min</span>
                <span className="text-sm text-gray-500">•</span>
                <div className="flex items-center text-sm text-blue-600">
                  <Award className="h-4 w-4 mr-1" />
                  {content.xpReward} XP
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* ✅ Enhanced XP Display */}
              <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border border-blue-200">
                <Trophy className="h-4 w-4 text-blue-600 mr-2" />
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-700">
                    {user?.progress?.totalXP || 0} XP
                  </div>
                  <div className="text-xs text-blue-600">
                    Level {Math.floor((user?.progress?.totalXP || 0) / 100) + 1}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <User className="h-4 w-4 inline mr-1" />
                {user?.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-3 space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-4 rounded-full relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </motion.div>
              </div>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="font-mono">
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Content Header */}
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {content.category.replace('-', ' ')}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h1>
                <p className="text-gray-600">{content.description}</p>
              </div>

              {/* Interactive Learning Section */}
              {content.type === 'video' && (
                <div className="p-6 border-b">
                  <div className="bg-gradient-to-br from-gray-100 to-blue-50 rounded-lg p-8 text-center relative overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-8 h-8 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="absolute top-8 right-8 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-8 left-8 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          isPlaying ? 'bg-orange-100' : 'bg-blue-100'
                        } transition-colors duration-300`}
                      >
                        {isPlaying ? (
                          <Pause className="h-8 w-8 text-orange-600" />
                        ) : (
                          <Play className="h-8 w-8 text-blue-600" />
                        )}
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2">Interactive Learning Session</h3>
                      <p className="text-gray-600 mb-4">
                        Click play to start your learning session. Progress will be tracked automatically.
                      </p>
                      <button
                        onClick={handlePlayPause}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                          isPlaying 
                            ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                        }`}
                      >
                        {isPlaying ? 'Pause Learning' : 'Start Learning'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Text Content */}
              <div className="p-6">
                <div className="prose max-w-none">
                  {content.content.text.split('\n').map((line, index) => {
                    if (line.startsWith('###')) {
                      return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-purple-700">{line.replace('###', '').trim()}</h3>;
                    }
                    if (line.startsWith('##')) {
                      return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-gray-900">{line.replace('##', '').trim()}</h2>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={index} className="mb-2 text-gray-800 font-semibold">{line.replace(/\*\*/g, '').trim()}</p>;
                    }
                    if (line.match(/^\d+\./)) {
                      return <p key={index} className="mb-2 text-gray-700 pl-4 border-l-2 border-blue-200">{line}</p>;
                    }
                    if (line.trim()) {
                      return <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>;
                    }
                    return <br key={index} />;
                  })}
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex flex-wrap gap-4">
                  {!isCompleted ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMarkComplete}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg shadow-green-200"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as Complete
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg font-semibold border-2 border-green-200"
                    >
                      <Trophy className="h-5 w-5 mr-2" />
                      Completed! +{content.xpReward} XP
                    </motion.div>
                  )}
                  <button
                    onClick={() => navigate('/learning')}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
                  >
                    Back to Learning Center
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Enhanced Learning Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 text-blue-600 mr-2" />
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700 font-medium">Time Spent</span>
                    <span className="font-bold text-blue-800">
                      {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-purple-700 font-medium">Progress</span>
                    <span className="font-bold text-purple-800">{Math.round(progress)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700 font-medium">XP to Earn</span>
                    <span className="font-bold text-green-800">+{content.xpReward} XP</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-yellow-700 font-medium">Total XP</span>
                    <span className="font-bold text-yellow-800">{user?.progress?.totalXP || 0} XP</span>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Motivational Quote */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full translate-y-6 -translate-x-6"></div>
                
                <div className="relative z-10">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">💡</span>
                    Learning Tip
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    "The expert in anything was once a beginner. Keep learning, stay curious, and celebrate every small victory!"
                  </p>
                </div>
              </motion.div>

              {/* Progress Milestone */}
              {progress > 50 && !isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl p-4"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-orange-800 mb-1">Halfway There!</h4>
                    <p className="text-sm text-orange-700">You're doing great! Keep going to earn your XP.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;
