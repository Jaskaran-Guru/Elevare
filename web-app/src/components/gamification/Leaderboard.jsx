import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

const Leaderboard = () => {
  const { leaderboard } = useGamification();
  const [timeframe, setTimeframe] = useState('all-time');

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <Award className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRankBackground = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
  };

  const getPositionChange = (rank) => {
    // Mock position changes - in real app this would come from historical data
    const changes = [null, '+2', '-1', '+1', '+3', '-2'];
    return changes[rank - 1];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
          <p className="text-gray-600">See how you rank against other learners</p>
        </div>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all-time">All Time</option>
          <option value="monthly">This Month</option>
          <option value="weekly">This Week</option>
          <option value="daily">Today</option>
        </select>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end space-x-4 mb-8">
        {leaderboard.slice(0, 3).map((user, index) => {
          const actualRank = user.rank;
          const podiumOrder = [1, 0, 2]; // Center 1st, left 2nd, right 3rd
          const podiumIndex = podiumOrder.indexOf(index);
          const heights = ['h-24', 'h-32', 'h-20'];
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: podiumIndex * 0.2 }}
              className={`flex flex-col items-center ${podiumIndex === 1 ? 'order-first' : ''}`}
            >
              {/* User Avatar & Info */}
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">{user.avatar}</div>
                <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                <div className="text-xs text-gray-600">{user.xp} XP</div>
                <div className="flex items-center justify-center mt-1">
                  {getRankIcon(actualRank)}
                  <span className="ml-1 text-xs font-bold">#{actualRank}</span>
                </div>
              </div>
              
              {/* Podium */}
              <div className={`${heights[podiumIndex]} w-20 ${getRankBackground(actualRank)} rounded-t-lg flex items-end justify-center pb-2`}>
                <span className="text-white font-bold text-lg">#{actualRank}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full Leaderboard List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 mb-4">Full Rankings</h3>
        {leaderboard.map((user, index) => {
          const positionChange = getPositionChange(user.rank);
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg transition-all hover:shadow-md ${
                user.name === 'You' || user.name.includes('You') 
                  ? 'bg-blue-50 border-2 border-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRankBackground(user.rank)}`}>
                    {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{user.avatar}</span>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center">
                        {user.name}
                        {(user.name === 'You' || user.name.includes('You')) && (
                          <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">You</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Level {user.level} • {user.badgeCount} badges
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-blue-600 text-lg">{user.xp} XP</div>
                  {positionChange && (
                    <div className={`text-sm flex items-center ${
                      positionChange.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        positionChange.startsWith('-') ? 'rotate-180' : ''
                      }`} />
                      {positionChange}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Your Stats Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Your Performance</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-bold text-2xl text-blue-600">
              #{leaderboard.find(u => u.name === 'You' || u.name.includes('You'))?.rank || '-'}
            </div>
            <div className="text-sm text-gray-600">Global Rank</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-green-600">
              {leaderboard.find(u => u.name === 'You' || u.name.includes('You'))?.xp || 0}
            </div>
            <div className="text-sm text-gray-600">Total XP</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-purple-600">
              {leaderboard.find(u => u.name === 'You' || u.name.includes('You'))?.badgeCount || 0}
            </div>
            <div className="text-sm text-gray-600">Badges</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
