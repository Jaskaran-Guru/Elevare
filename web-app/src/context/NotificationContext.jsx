import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [lastActivity, setLastActivity] = useState(new Date());

  // Request notification permission on load
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
          if (permission === 'granted') {
            toast.success('Notifications enabled! 🔔');
          }
        });
      } else {
        setNotificationPermission(Notification.permission);
      }
    }
  }, []);

  // Track user activity for smart reminders
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(new Date());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  // Smart reminder system
  useEffect(() => {
    if (!user) return;

    const checkForReminders = setInterval(() => {
      const now = new Date();
      const timeSinceLastActivity = (now - lastActivity) / (1000 * 60); // minutes

      // Remind user to continue learning after 30 minutes of inactivity
      if (timeSinceLastActivity > 30) {
        showNotification({
          type: 'reminder',
          title: 'Continue Your Learning Journey! 📚',
          message: 'You have courses waiting for you. Let\'s keep the momentum going!',
          action: () => window.location.href = '/learning'
        });
      }

      // Daily learning streak reminder
      const lastLearningDate = localStorage.getItem('lastLearningDate');
      const today = new Date().toDateString();
      
      if (lastLearningDate !== today && now.getHours() === 19) { // 7 PM reminder
        showNotification({
          type: 'streak',
          title: 'Don\'t Break Your Streak! 🔥',
          message: 'Complete at least one course today to maintain your learning streak.',
          action: () => window.location.href = '/learning'
        });
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(checkForReminders);
  }, [user, lastActivity]);

  // Add notification to queue
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show in-app toast
    switch (notification.type) {
      case 'achievement':
        toast.success(notification.message, { 
          duration: 6000,
          icon: '🏆'
        });
        break;
      case 'reminder':
        toast(notification.message, { 
          duration: 8000,
          icon: '⏰'
        });
        break;
      case 'quiz':
        toast.success(notification.message, { 
          duration: 5000,
          icon: '🧠'
        });
        break;
      default:
        toast(notification.message);
    }

    return newNotification.id;
  };

  // Show browser notification
  const showNotification = (notification) => {
    if (notificationPermission === 'granted' && 'Notification' in window) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: notification.type,
        requireInteraction: notification.type === 'achievement'
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.action) {
          notification.action();
        }
        browserNotification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 10000);
    }

    // Always add to in-app notifications
    return addNotification(notification);
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Achievement notifications
  const notifyAchievement = (achievement) => {
    return showNotification({
      type: 'achievement',
      title: `🎉 Achievement Unlocked!`,
      message: `You earned "${achievement.title}"! +${achievement.xp} XP`,
      priority: 'high'
    });
  };

  // Course completion notifications
  const notifyCourseComplete = (courseTitle, xpEarned) => {
    return showNotification({
      type: 'completion',
      title: '✅ Course Completed!',
      message: `Great job completing "${courseTitle}"! You earned ${xpEarned} XP.`,
      priority: 'high'
    });
  };

  // Quiz result notifications
  const notifyQuizResult = (score, total, xpEarned) => {
    const percentage = Math.round((score / total) * 100);
    const isGoodScore = percentage >= 70;
    
    return showNotification({
      type: 'quiz',
      title: isGoodScore ? '🎯 Great Quiz Score!' : '📝 Quiz Completed',
      message: `You scored ${score}/${total} (${percentage}%) and earned ${xpEarned} XP!`,
      priority: isGoodScore ? 'high' : 'medium'
    });
  };

  // Level up notifications
  const notifyLevelUp = (newLevel, totalXP) => {
    return showNotification({
      type: 'levelup',
      title: '🚀 Level Up!',
      message: `Congratulations! You've reached Level ${newLevel} with ${totalXP} XP!`,
      priority: 'high'
    });
  };

  // Study reminder notifications
  const notifyStudyReminder = (subject) => {
    return showNotification({
      type: 'reminder',
      title: '📚 Study Reminder',
      message: `Time to review ${subject}! Keep your learning momentum going.`,
      priority: 'medium'
    });
  };

  const value = {
    notifications,
    notificationPermission,
    addNotification,
    showNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    notifyAchievement,
    notifyCourseComplete,
    notifyQuizResult,
    notifyLevelUp,
    notifyStudyReminder
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
