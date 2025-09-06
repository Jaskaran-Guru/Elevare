import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState({
    startTime: null,
    totalTimeSpent: 0,
    activeTime: 0,
    coursesViewed: [],
    quizzesTaken: [],
    currentStreak: 0
  });

  const [learningPatterns, setLearningPatterns] = useState({
    preferredTimeSlots: [],
    averageSessionDuration: 0,
    mostActiveDay: '',
    completionRate: 0,
    engagementScore: 0
  });

  // Track session start
  const startSession = () => {
    setSessionData(prev => ({
      ...prev,
      startTime: new Date(),
    }));
  };

  // Track content engagement
  const trackContentEngagement = (contentId, timeSpent, completionPercentage) => {
    const engagement = {
      contentId,
      timeSpent,
      completionPercentage,
      timestamp: new Date(),
      userId: user?.id
    };

    // Store in localStorage for persistence
    const existingData = JSON.parse(localStorage.getItem('learningAnalytics') || '[]');
    existingData.push(engagement);
    localStorage.setItem('learningAnalytics', JSON.stringify(existingData));

    // Update session data
    setSessionData(prev => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + timeSpent,
      coursesViewed: [...new Set([...prev.coursesViewed, contentId])]
    }));
  };

  // Track quiz performance
  const trackQuizPerformance = (quizId, score, totalQuestions, timeToComplete) => {
    const quizData = {
      quizId,
      score,
      totalQuestions,
      percentage: (score / totalQuestions) * 100,
      timeToComplete,
      timestamp: new Date(),
      userId: user?.id
    };

    setSessionData(prev => ({
      ...prev,
      quizzesTaken: [...prev.quizzesTaken, quizData]
    }));

    // Store quiz analytics
    const quizAnalytics = JSON.parse(localStorage.getItem('quizAnalytics') || '[]');
    quizAnalytics.push(quizData);
    localStorage.setItem('quizAnalytics', JSON.stringify(quizAnalytics));
  };

  // Calculate learning patterns
  const calculateLearningPatterns = () => {
    const analyticsData = JSON.parse(localStorage.getItem('learningAnalytics') || '[]');
    const userAnalytics = analyticsData.filter(data => data.userId === user?.id);

    if (userAnalytics.length > 0) {
      // Calculate average session duration
      const totalTime = userAnalytics.reduce((sum, session) => sum + session.timeSpent, 0);
      const averageSessionDuration = totalTime / userAnalytics.length;

      // Calculate completion rate
      const completedSessions = userAnalytics.filter(session => session.completionPercentage >= 80);
      const completionRate = (completedSessions.length / userAnalytics.length) * 100;

      // Calculate engagement score (combination of time spent and completion rate)
      const engagementScore = (averageSessionDuration * 0.3) + (completionRate * 0.7);

      setLearningPatterns({
        averageSessionDuration,
        completionRate,
        engagementScore,
        preferredTimeSlots: getPreferredTimeSlots(userAnalytics),
        mostActiveDay: getMostActiveDay(userAnalytics)
      });
    }
  };

  // Helper functions
  const getPreferredTimeSlots = (data) => {
    const timeSlots = data.map(session => {
      const hour = new Date(session.timestamp).getHours();
      if (hour < 12) return 'Morning';
      if (hour < 17) return 'Afternoon';
      return 'Evening';
    });

    const counts = timeSlots.reduce((acc, slot) => {
      acc[slot] = (acc[slot] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .map(([slot]) => slot);
  };

  const getMostActiveDay = (data) => {
    const days = data.map(session => 
      new Date(session.timestamp).toLocaleDateString('en-US', { weekday: 'long' })
    );

    const counts = days.reduce((acc, day) => {
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Monday';
  };

  // Generate personalized recommendations
  const getPersonalizedRecommendations = () => {
    const recommendations = [];

    if (learningPatterns.completionRate < 50) {
      recommendations.push({
        type: 'completion',
        title: 'Improve Course Completion',
        description: 'Try breaking down courses into smaller segments for better completion rates.',
        priority: 'high'
      });
    }

    if (learningPatterns.averageSessionDuration < 15) {
      recommendations.push({
        type: 'engagement',
        title: 'Extend Learning Sessions',
        description: 'Consider longer study sessions for deeper understanding.',
        priority: 'medium'
      });
    }

    if (sessionData.currentStreak === 0) {
      recommendations.push({
        type: 'consistency',
        title: 'Build Learning Consistency',
        description: 'Try to learn something new every day to build a learning streak.',
        priority: 'high'
      });
    }

    return recommendations;
  };

  // Effect to calculate patterns periodically
  useEffect(() => {
    if (user) {
      calculateLearningPatterns();
      startSession();
    }
  }, [user]);

  const value = {
    sessionData,
    learningPatterns,
    trackContentEngagement,
    trackQuizPerformance,
    calculateLearningPatterns,
    getPersonalizedRecommendations,
    startSession
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
