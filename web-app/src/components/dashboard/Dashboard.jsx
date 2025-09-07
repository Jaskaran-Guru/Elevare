import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, BookOpen, Target, Award, TrendingUp, Trophy, Star, BarChart, Brain } from 'lucide-react'; // ✅ ADD Brain icon
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Quiz from '../quiz/Quiz';
import toast from 'react-hot-toast';
import NotificationBell from '../notifications/NotificationBell';

const Dashboard = () => {
  const { user, logout, earnXP } = useAuth();
  const navigate = useNavigate();
  
  // ✅ ALL STATE HOOKS INSIDE COMPONENT
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // ✅ ALL HANDLERS INSIDE COMPONENT
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (results) => {
    setQuizCompleted(true);
    setShowQuiz(false);
    
    // Award XP based on quiz performance
    const bonusXP = Math.round(results.percentage / 10); // 10% = 1 XP
    earnXP(bonusXP, 'Quiz Completion');
    
    toast.success(
      `Quiz completed! Score: ${results.score}/${results.total} (${results.percentage}%) +${bonusXP} XP!`,
      { duration: 5000 }
    );
  };

  // Calculate user level and progress
  const userXP = user?.progress?.totalXP || 0;
  const currentLevel = Math.floor(userXP / 100) + 1;
  const xpInCurrentLevel = userXP % 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  const stats = [
    { name: 'Modules Completed', value: user?.progress?.modulesCompleted || '0', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Current Streak', value: user?.progress?.currentStreak ? `${user.progress.currentStreak} days` : '0 days', icon: Target, color: 'bg-green-500' },
    { name: 'XP Points', value: userXP.toString(), icon: Award, color: 'bg-yellow-500' },
    { name: 'Level', value: currentLevel.toString(), icon: Trophy, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Elevare
              </h1>
              <span className="ml-3 text-gray-600">Dashboard</span>
              
              {/* ✅ ENHANCED Navigation Menu with AI Syllabus */}
              <div className="ml-8 flex space-x-4">
                <Link to="/learning" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Learning
                </Link>
                <Link to="/analytics" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                  Analytics
                </Link>
               
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm font-medium text-blue-600">Level {currentLevel}</span>
              </div>
              
              {/* ✅ ADD NOTIFICATION BELL */}
              <NotificationBell />
              
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Elevare, {user?.name}! <span role="img" aria-label="wave">👋</span>
            </h1>
            <p className="text-gray-600 mt-2">
              You're in {user?.grade} {user?.stream && `- ${user.stream.charAt(0).toUpperCase() + user.stream.slice(1)}`}
            </p>
            <p className="text-gray-600">Ready to start your learning journey?</p>
          </div>

          {/* XP Progress Section */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center">
                  <Trophy className="h-6 w-6 mr-2" />
                  Your Learning Journey
                </h3>
                <p className="text-blue-100 mt-1">Keep learning to unlock the next level!</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userXP} XP</div>
                <div className="text-blue-100 text-sm">Total Experience</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Level {currentLevel}</span>
                <span>Level {currentLevel + 1}</span>
              </div>
              <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-yellow-300 to-green-300 h-4 rounded-full flex items-center justify-center text-xs font-bold text-gray-800"
                  style={{ width: `${xpInCurrentLevel}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpInCurrentLevel}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {xpInCurrentLevel > 20 && `${xpInCurrentLevel}%`}
                </motion.div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-blue-100">
              <span>{xpInCurrentLevel}/100 XP in Level {currentLevel}</span>
              <span>{xpToNextLevel} XP to Level {currentLevel + 1}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

      

          {/* Quick Quiz Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2" role="img" aria-label="brain">🧠</span>
              Quick Knowledge Test
            </h2>
            <p className="text-gray-600 mb-6">
              Test your knowledge with a quick quiz and earn bonus XP!
            </p>
            
            <button
              onClick={handleStartQuiz}
              disabled={showQuiz}
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <BookOpen className="h-6 w-6 mr-2" />
              {showQuiz ? 'Quiz in Progress...' : 'Take Quiz'}
              <Award className="h-5 w-5 ml-2" />
            </button>
            
            {quizCompleted && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-600 font-semibold">
                  <span role="img" aria-label="check" className="mr-2">✅</span>
                  Quiz completed! Great job earning those XP points!
                </div>
              </div>
            )}
          </div>

          {/* Getting Started Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="text-2xl mr-2" role="img" aria-label="rocket">🚀</span>
              Getting Started
            </h2>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
                  <p className="text-gray-600 text-sm">Add more details about your interests and goals</p>
                </div>
                <div className="text-blue-500 text-sm font-medium">+5 XP</div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-900">Take Assessment</h3>
                  <p className="text-gray-600 text-sm">Help us understand your current knowledge level</p>
                </div>
                <div className="text-green-500 text-sm font-medium">+10 XP</div>
              </div>
              
              {/* Step 3 */}
              <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-900">Start Learning</h3>
                  <p className="text-gray-600 text-sm">Begin with personalized modules for your grade</p>
                </div>
                <div className="text-purple-500 text-sm font-medium">+15 XP per course</div>
              </div>

              {/* Step 4 - Analytics */}
              <div className="flex items-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-gray-600 text-sm">Track your learning progress and get insights</p>
                </div>
                <div className="text-orange-500 text-sm font-medium">
                  <Link 
                    to="/analytics" 
                    className="inline-flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </div>
              </div>

              
           
            </div>
          </div>

          {/* Start Learning Button */}
          <div className="text-center mb-8">
            <div className="space-x-4">
              <Link 
                to="/learning"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <BookOpen className="h-7 w-7 mr-3" />
                Start Learning Journey
                <Award className="h-5 w-5 ml-2" />
              </Link>
              
             
            </div>
            <p className="text-gray-500 text-sm mt-2">Choose traditional learning or try our AI-powered study materials!</p>
          </div>

          {/* Achievement Preview */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <span role="img" aria-label="trophy">🏆</span> Next Achievement
                </h3>
                <p className="text-gray-600">
                  {userXP < 50 ? "Complete 3 courses to earn your first badge!" :
                   userXP < 100 ? "Reach 100 XP to unlock Level 2!" :
                   "Keep learning to unlock more achievements!"}
                </p>
              </div>
              <div className="text-4xl">
                {userXP < 50 ? 
                  <span role="img" aria-label="bronze medal">🥉</span> : 
                  userXP < 100 ? 
                    <span role="img" aria-label="silver medal">🥈</span> : 
                    <span role="img" aria-label="gold medal">🥇</span>
                }
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">
              <span role="img" aria-label="party">🎉</span> Congratulations!
            </h3>
            <p className="text-blue-100">
              You've successfully created your Elevare account. Your journey to career excellence starts here!
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Level {currentLevel}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {userXP} XP
              </span>
              <span>•</span>
              <span>{user?.grade} {user?.stream}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <Quiz 
              contentId="dashboard-quiz" 
              onComplete={handleQuizComplete}
            />
            <button
              onClick={() => setShowQuiz(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Close Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
