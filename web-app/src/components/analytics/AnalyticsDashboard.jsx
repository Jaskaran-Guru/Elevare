import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  TrendingUp, 
  Clock, 
  Target, 
  Brain, 
  Calendar,
  Award,
  Activity,
  Users,
  BookOpen,
  ArrowLeft  // ✅ ADD THIS IMPORT
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useNavigate, Link } from 'react-router-dom'; // ✅ ADD useNavigate

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const { sessionData, learningPatterns, getPersonalizedRecommendations } = useAnalytics();
  const navigate = useNavigate(); // ✅ ADD NAVIGATION HOOK
  const [recommendations, setRecommendations] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    setRecommendations(getPersonalizedRecommendations());
  }, [learningPatterns]);

  // Mock data for charts
  const weeklyProgress = [
    { day: 'Mon', xp: 15, time: 45 },
    { day: 'Tue', xp: 22, time: 60 },
    { day: 'Wed', xp: 18, time: 30 },
    { day: 'Thu', xp: 35, time: 75 },
    { day: 'Fri', xp: 28, time: 50 },
    { day: 'Sat', xp: 40, time: 90 },
    { day: 'Sun', xp: 12, time: 25 }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', score: 85, improvement: '+5%' },
    { subject: 'Physics', score: 78, improvement: '+12%' },
    { subject: 'Chemistry', score: 92, improvement: '+3%' },
    { subject: 'Biology', score: 88, improvement: '+8%' }
  ];

  const getRecommendationColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ HEADER WITH BACK BUTTON */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* ✅ BACK BUTTON */}
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              
              {/* ✅ ALTERNATIVE: SPECIFIC BACK TO DASHBOARD */}
              {/* Uncomment this instead of navigate(-1) if you want to always go to dashboard */}
              {/* 
              <Link 
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              */}
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Elevare
                </h1>
                <span className="ml-3 text-gray-600">Analytics Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
            <p className="text-gray-600 mt-1">Insights into your learning journey</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Time</p>
                <p className="text-2xl font-bold text-gray-900">{sessionData.totalTimeSpent || 0}m</p>
                <p className="text-sm text-green-600">+15% this week</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(learningPatterns.completionRate || 0)}%</p>
                <p className="text-sm text-green-600">+8% improvement</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Score</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(learningPatterns.engagementScore || 0)}</p>
                <p className="text-sm text-blue-600">Above average</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{sessionData.currentStreak || 0} days</p>
                <p className="text-sm text-orange-600">Keep it up!</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
              <BarChart className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {weeklyProgress.map((day, index) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{day.xp} XP</span>
                      <span className="text-sm text-gray-500">{day.time}min</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(day.xp / 40) * 100}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.xp / 40) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
              <TrendingUp className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <div key={subject.subject} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{subject.subject}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-green-600 font-medium">{subject.improvement}</span>
                    <span className="text-lg font-bold text-gray-900">{subject.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Rest of your analytics content... */}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
