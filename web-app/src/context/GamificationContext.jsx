import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const { user, earnXP } = useAuth();
  const { notifyAchievement } = useNotifications();
  const [userBadges, setUserBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  // Badge definitions
  const allBadges = [
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first course',
      icon: '🎯',
      requirement: { type: 'courses_completed', count: 1 },
      xp: 10,
      rarity: 'common'
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Score 100% on 3 quizzes',
      icon: '🧠',
      requirement: { type: 'perfect_quizzes', count: 3 },
      xp: 25,
      rarity: 'rare'
    },
    {
      id: 'speed_learner',
      title: 'Speed Learner',
      description: 'Complete 5 courses in one day',
      icon: '⚡',
      requirement: { type: 'daily_courses', count: 5 },
      xp: 30,
      rarity: 'epic'
    },
    {
      id: 'streak_champion',
      title: 'Streak Champion',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      requirement: { type: 'learning_streak', count: 7 },
      xp: 35,
      rarity: 'epic'
    },
    {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Earn 500 total XP',
      icon: '📚',
      requirement: { type: 'total_xp', count: 500 },
      xp: 40,
      rarity: 'legendary'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete 10 courses with 100% accuracy',
      icon: '💎',
      requirement: { type: 'perfect_courses', count: 10 },
      xp: 50,
      rarity: 'legendary'
    },
    {
      id: 'social_learner',
      title: 'Social Learner',
      description: 'Help 5 fellow students',
      icon: '🤝',
      requirement: { type: 'help_count', count: 5 },
      xp: 20,
      rarity: 'rare'
    },
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Complete 3 courses after 10 PM',
      icon: '🦉',
      requirement: { type: 'night_learning', count: 3 },
      xp: 15,
      rarity: 'uncommon'
    },
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Complete 3 courses before 7 AM',
      icon: '🐦',
      requirement: { type: 'morning_learning', count: 3 },
      xp: 15,
      rarity: 'uncommon'
    },
    {
      id: 'comeback_king',
      title: 'Comeback King',
      description: 'Return after 7+ days and complete a course',
      icon: '👑',
      requirement: { type: 'comeback', count: 1 },
      xp: 25,
      rarity: 'rare'
    }
  ];

  // Load user progress
  useEffect(() => {
    if (user) {
      const badges = JSON.parse(localStorage.getItem(`badges_${user.id}`) || '[]');
      setUserBadges(badges);
      loadLeaderboard();
      generateDailyChallenge();
    }
  }, [user]);

  // Check for new badges
  const checkBadgeProgress = (actionType, data = {}) => {
    if (!user) return;

    const userStats = getUserStats();
    const newBadges = [];

    allBadges.forEach(badge => {
      // Skip if user already has this badge
      if (userBadges.find(ub => ub.id === badge.id)) return;

      const req = badge.requirement;
      let earned = false;

      switch (req.type) {
        case 'courses_completed':
          earned = userStats.coursesCompleted >= req.count;
          break;
        case 'perfect_quizzes':
          earned = userStats.perfectQuizzes >= req.count;
          break;
        case 'daily_courses':
          if (actionType === 'course_completed') {
            const today = new Date().toDateString();
            const todayCourses = getUserTodayActivity();
            earned = todayCourses >= req.count;
          }
          break;
        case 'learning_streak':
          earned = userStats.currentStreak >= req.count;
          break;
        case 'total_xp':
          earned = userStats.totalXP >= req.count;
          break;
        case 'perfect_courses':
          earned = userStats.perfectCourses >= req.count;
          break;
        case 'help_count':
          earned = userStats.helpCount >= req.count;
          break;
        case 'night_learning':
          if (actionType === 'course_completed' && new Date().getHours() >= 22) {
            const nightLearning = getNightLearningCount();
            earned = nightLearning >= req.count;
          }
          break;
        case 'morning_learning':
          if (actionType === 'course_completed' && new Date().getHours() < 7) {
            const morningLearning = getMorningLearningCount();
            earned = morningLearning >= req.count;
          }
          break;
        case 'comeback':
          if (actionType === 'course_completed') {
            const lastActivity = new Date(localStorage.getItem('lastLearningDate') || Date.now());
            const daysSince = (new Date() - lastActivity) / (1000 * 60 * 60 * 24);
            earned = daysSince >= 7;
          }
          break;
      }

      if (earned) {
        newBadges.push({
          ...badge,
          earnedAt: new Date().toISOString()
        });
      }
    });

    if (newBadges.length > 0) {
      const updatedBadges = [...userBadges, ...newBadges];
      setUserBadges(updatedBadges);
      localStorage.setItem(`badges_${user.id}`, JSON.stringify(updatedBadges));

      // Notify about new badges
      newBadges.forEach((badge, index) => {
        setTimeout(() => {
          notifyAchievement({
            title: `🏆 Badge Earned: ${badge.title}`,
            xp: badge.xp
          });
          earnXP(badge.xp, `Badge: ${badge.title}`);
        }, index * 2000);
      });
    }

    return newBadges;
  };

  // Get user statistics
  const getUserStats = () => {
    return {
      coursesCompleted: user?.progress?.modulesCompleted || 0,
      totalXP: user?.progress?.totalXP || 0,
      currentStreak: user?.progress?.currentStreak || 0,
      perfectQuizzes: parseInt(localStorage.getItem(`perfectQuizzes_${user?.id}`) || '0'),
      perfectCourses: parseInt(localStorage.getItem(`perfectCourses_${user?.id}`) || '0'),
      helpCount: parseInt(localStorage.getItem(`helpCount_${user?.id}`) || '0')
    };
  };

  // Helper functions
  const getUserTodayActivity = () => {
    const today = new Date().toDateString();
    const todayActivity = JSON.parse(localStorage.getItem(`todayActivity_${user?.id}`) || '[]');
    return todayActivity.filter(activity => 
      new Date(activity.date).toDateString() === today && activity.type === 'course_completed'
    ).length;
  };

  const getNightLearningCount = () => {
    return parseInt(localStorage.getItem(`nightLearning_${user?.id}`) || '0');
  };

  const getMorningLearningCount = () => {
    return parseInt(localStorage.getItem(`morningLearning_${user?.id}`) || '0');
  };

  // Load leaderboard
  const loadLeaderboard = () => {
    // In a real app, this would come from your backend
    const mockLeaderboard = [
      { id: 1, name: 'Alex Johnson', xp: 1250, level: 13, avatar: '👨‍🎓', badgeCount: 8 },
      { id: 2, name: 'Priya Sharma', xp: 1100, level: 11, avatar: '👩‍🎓', badgeCount: 7 },
      { id: 3, name: 'Mike Chen', xp: 980, level: 10, avatar: '👨‍💻', badgeCount: 6 },
      { id: 4, name: user?.name || 'You', xp: user?.progress?.totalXP || 0, level: Math.floor((user?.progress?.totalXP || 0) / 100) + 1, avatar: '🎓', badgeCount: userBadges.length },
      { id: 5, name: 'Sarah Wilson', xp: 875, level: 9, avatar: '👩‍💼', badgeCount: 5 }
    ];

    // Sort by XP and add ranks
    const sortedLeaderboard = mockLeaderboard
      .sort((a, b) => b.xp - a.xp)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    setLeaderboard(sortedLeaderboard);
  };

  // Generate daily challenge
  const generateDailyChallenge = () => {
    const challenges = [
      { id: 1, title: 'Speed Run', description: 'Complete 3 courses today', reward: 50, type: 'courses', target: 3 },
      { id: 2, title: 'Quiz Master', description: 'Score 80%+ on 2 quizzes', reward: 30, type: 'quiz_score', target: 2 },
      { id: 3, title: 'Streak Builder', description: 'Study for 30+ minutes', reward: 25, type: 'study_time', target: 30 },
      { id: 4, title: 'Perfect Score', description: 'Get 100% on any quiz', reward: 40, type: 'perfect_quiz', target: 1 },
      { id: 5, title: 'Knowledge Explorer', description: 'Try a new subject category', reward: 35, type: 'new_category', target: 1 }
    ];

    const today = new Date().toDateString();
    const storedChallenge = localStorage.getItem(`dailyChallenge_${today}`);

    if (storedChallenge) {
      setDailyChallenge(JSON.parse(storedChallenge));
    } else {
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      const challengeWithProgress = { ...randomChallenge, progress: 0, completed: false };
      setDailyChallenge(challengeWithProgress);
      localStorage.setItem(`dailyChallenge_${today}`, JSON.stringify(challengeWithProgress));
    }
  };

  // Update daily challenge progress
  const updateChallengeProgress = (actionType, data = {}) => {
    if (!dailyChallenge || dailyChallenge.completed) return;

    let newProgress = dailyChallenge.progress;
    let completed = false;

    switch (dailyChallenge.type) {
      case 'courses':
        if (actionType === 'course_completed') {
          newProgress = Math.min(newProgress + 1, dailyChallenge.target);
        }
        break;
      case 'quiz_score':
        if (actionType === 'quiz_completed' && data.percentage >= 80) {
          newProgress = Math.min(newProgress + 1, dailyChallenge.target);
        }
        break;
      case 'study_time':
        if (actionType === 'study_session') {
          newProgress = Math.min(newProgress + data.minutes, dailyChallenge.target);
        }
        break;
      case 'perfect_quiz':
        if (actionType === 'quiz_completed' && data.percentage === 100) {
          newProgress = dailyChallenge.target;
        }
        break;
      case 'new_category':
        if (actionType === 'new_category_explored') {
          newProgress = dailyChallenge.target;
        }
        break;
    }

    completed = newProgress >= dailyChallenge.target;

    const updatedChallenge = { ...dailyChallenge, progress: newProgress, completed };
    setDailyChallenge(updatedChallenge);

    const today = new Date().toDateString();
    localStorage.setItem(`dailyChallenge_${today}`, JSON.stringify(updatedChallenge));

    if (completed && !dailyChallenge.completed) {
      setTimeout(() => {
        notifyAchievement({
          title: '🎯 Daily Challenge Complete!',
          xp: dailyChallenge.reward
        });
        earnXP(dailyChallenge.reward, 'Daily Challenge');
      }, 1000);
    }
  };

  // Record user activity
  const recordActivity = (type, data = {}) => {
    const activity = {
      type,
      date: new Date().toISOString(),
      ...data
    };

    // Store today's activity
    const today = new Date().toDateString();
    const todayActivity = JSON.parse(localStorage.getItem(`todayActivity_${user?.id}`) || '[]');
    todayActivity.push(activity);
    localStorage.setItem(`todayActivity_${user?.id}`, JSON.stringify(todayActivity));

    // Update learning timestamps
    localStorage.setItem('lastLearningDate', today);

    // Record time-based activities
    const hour = new Date().getHours();
    if (type === 'course_completed') {
      if (hour >= 22 || hour < 6) {
        const nightCount = getNightLearningCount() + 1;
        localStorage.setItem(`nightLearning_${user?.id}`, nightCount.toString());
      }
      if (hour < 7) {
        const morningCount = getMorningLearningCount() + 1;
        localStorage.setItem(`morningLearning_${user?.id}`, morningCount.toString());
      }
    }

    // Check for badges and update challenges
    checkBadgeProgress(type, data);
    updateChallengeProgress(type, data);
    loadLeaderboard(); // Refresh leaderboard
  };

  const value = {
    userBadges,
    allBadges,
    leaderboard,
    dailyChallenge,
    recordActivity,
    checkBadgeProgress,
    getUserStats,
    updateChallengeProgress
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
