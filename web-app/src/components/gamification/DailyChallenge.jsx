import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Award, CheckCircle, Calendar } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

const DailyChallenge = () => {
  const { dailyChallenge } = useGamification();

  if (!dailyChallenge) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Loading daily challenge...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (dailyChallenge.progress / dailyChallenge.target) * 100;
  const isCompleted = dailyChallenge.completed;

  const getChallengeIcon = (type) => {
    switch (type) {
      case 'courses': return '📚';
      case 'quiz_score': return '🎯';
      case 'study_time': return '⏱️';
      case 'perfect_quiz': return '💯';
      case 'new_category': return '🔍';
      default: return '🎯';
    }
  };

  const getProgressText = () => {
    switch (dailyChallenge.type) {
      case 'courses':
        return `${dailyChallenge.progress}/${dailyChallenge.target} courses`;
      case 'quiz_score':
        return `${dailyChallenge.progress}/${dailyChallenge.target} quizzes`;
      case 'study_time':
        return `${dailyChallenge.progress}/${dailyChallenge.target} minutes`;
      case 'perfect_quiz':
        return `${dailyChallenge.progress}/${dailyChallenge.target} perfect score`;
      case 'new_category':
        return `${dailyChallenge.progress}/${dailyChallenge.target} new category`;
      default:
        return `${dailyChallenge.progress}/${dailyChallenge.target}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className={`p-6 ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-3xl mr-3">{getChallengeIcon(dailyChallenge.type)}</div>
            <div>
              <h3 className="text-xl font-bold">Daily Challenge</h3>
              <p className="text-blue-100 opacity-90">
                {isCompleted ? 'Completed!' : 'Active Challenge'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-blue-100 mb-1">
              <Award className="h-4 w-4 mr-1" />
              <span className="text-sm">Reward</span>
            </div>
            <div className="text-2xl font-bold">+{dailyChallenge.reward} XP</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {dailyChallenge.title}
          </h4>
          <p className="text-gray-600 mb-4">
            {dailyChallenge.description}
          </p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{getProgressText()}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{Math.round(progressPercentage)}% complete</span>
              <span>{dailyChallenge.target - dailyChallenge.progress > 0 ? `${dailyChallenge.target - dailyChallenge.progress} remaining` : 'Complete!'}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        {isCompleted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-semibold">Challenge Completed!</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              Great job! You've earned {dailyChallenge.reward} XP. Come back tomorrow for a new challenge!
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center text-blue-600">
              <Target className="h-5 w-5 mr-2" />
              <span className="font-semibold">Challenge Active</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">
              Keep going! Complete this challenge before midnight to earn your reward.
            </p>
          </div>
        )}

        {/* Time Remaining */}
        <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>Resets at midnight</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
