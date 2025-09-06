import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Target, BookOpen, Zap } from 'lucide-react';

const AchievementCard = ({ achievement, unlocked = false }) => {
  const getAchievementIcon = (type) => {
    switch (type) {
      case 'course': return <BookOpen className="h-8 w-8" />;
      case 'quiz': return <Target className="h-8 w-8" />;
      case 'xp': return <Zap className="h-8 w-8" />;
      case 'streak': return <Star className="h-8 w-8" />;
      default: return <Award className="h-8 w-8" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-xl border-2 transition-all ${
        unlocked 
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' 
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
    >
      <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
        unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'
      }`}>
        {getAchievementIcon(achievement.type)}
      </div>
      
      <h3 className={`font-semibold text-center mb-1 ${
        unlocked ? 'text-gray-900' : 'text-gray-500'
      }`}>
        {achievement.title}
      </h3>
      
      <p className={`text-sm text-center ${
        unlocked ? 'text-gray-600' : 'text-gray-400'
      }`}>
        {achievement.description}
      </p>
      
      {unlocked && (
        <div className="mt-2 text-center">
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            +{achievement.xp} XP
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default AchievementCard;
