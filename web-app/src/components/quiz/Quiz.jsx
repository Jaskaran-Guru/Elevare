import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext'; // ✅ ADD THIS
import toast from 'react-hot-toast';

const Quiz = ({ contentId, onComplete }) => {
  const { earnXP } = useAuth();
  const { notifyQuizResult, notifyAchievement } = useNotifications(); // ✅ ADD THIS
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Sample quiz questions based on content
  const quizQuestions = [
    {
      id: 1,
      question: "What is the definition of motion in physics?",
      options: [
        "Change in position with respect to time",
        "Force applied on an object", 
        "Energy stored in an object",
        "Mass times acceleration"
      ],
      correct: 0,
      explanation: "Motion is defined as the change in position of an object with respect to time."
    },
    {
      id: 2,
      question: "Which of the following represents velocity?",
      options: [
        "Speed only",
        "Distance traveled", 
        "Speed with direction",
        "Time taken to travel"
      ],
      correct: 2,
      explanation: "Velocity is speed with a specific direction, making it a vector quantity."
    },
    {
      id: 3,
      question: "What is acceleration?",
      options: [
        "Constant speed",
        "Change in velocity over time", 
        "Distance per unit time",
        "Force times mass"
      ],
      correct: 1,
      explanation: "Acceleration is the rate of change of velocity with respect to time."
    },
    {
      id: 4,
      question: "In uniform motion, what remains constant?",
      options: [
        "Acceleration",
        "Force", 
        "Velocity",
        "Time"
      ],
      correct: 2,
      explanation: "In uniform motion, an object moves with constant velocity."
    },
    {
      id: 5,
      question: "What type of motion does a pendulum exhibit?",
      options: [
        "Linear motion",
        "Rotational motion", 
        "Oscillatory motion",
        "Random motion"
      ],
      correct: 2,
      explanation: "A pendulum exhibits oscillatory motion as it swings back and forth."
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, showResult, quizCompleted]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success('Correct! 🎉');
    } else {
      toast.error('Incorrect 😞');
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      setShowResult(true);
      
      // Calculate final score and award XP
      const finalScore = isCorrect ? score + 1 : score;
      const percentage = (finalScore / quizQuestions.length) * 100;
      const xpEarned = Math.round(percentage / 10); // 10% = 1 XP, 100% = 10 XP
      
      earnXP(xpEarned, 'Quiz Completion');
      
      // ✅ SEND QUIZ NOTIFICATION
      notifyQuizResult(finalScore, quizQuestions.length, xpEarned);
      
      // ✅ CHECK FOR PERFECT SCORE ACHIEVEMENT
      if (percentage === 100) {
        setTimeout(() => {
          notifyAchievement({
            title: 'Perfect Quiz Score! 🎯',
            xp: 5
          });
        }, 2000);
      }
      
      // ✅ CHECK FOR QUIZ STREAK ACHIEVEMENT
      const quizStreak = parseInt(localStorage.getItem('quizStreak') || '0') + 1;
      localStorage.setItem('quizStreak', quizStreak.toString());
      
      if (quizStreak === 5) {
        setTimeout(() => {
          notifyAchievement({
            title: 'Quiz Master! 🏆',
            xp: 10
          });
        }, 3000);
      }
      
      if (onComplete) {
        onComplete({ score: finalScore, total: quizQuestions.length, percentage });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "Excellent! 🏆";
    if (percentage >= 60) return "Good job! 👍";
    if (percentage >= 40) return "Keep practicing! 💪";
    return "Need more study! 📚";
  };

  // ✅ ENHANCED RESULT SCREEN WITH ACHIEVEMENTS
  if (showResult) {
    const percentage = (score / quizQuestions.length) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            score >= quizQuestions.length * 0.6 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {score >= quizQuestions.length * 0.6 ? 
              <CheckCircle className="h-10 w-10 text-green-600" /> : 
              <XCircle className="h-10 w-10 text-red-600" />
            }
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-lg text-gray-600 mb-4">{getScoreMessage()}</p>
          
          {/* ✅ ACHIEVEMENT BADGES */}
          <div className="flex justify-center space-x-2 mb-4">
            {percentage === 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold"
              >
                🎯 Perfect Score!
              </motion.div>
            )}
            {percentage >= 80 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 }}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
              >
                ⭐ High Score!
              </motion.div>
            )}
            {score > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4 }}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
              >
                🧠 Knowledge Gained
              </motion.div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">{quizQuestions.length - score}</div>
              <div className="text-sm text-gray-600">Wrong</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(percentage)}%
            </div>
            <div className="text-sm text-gray-600">Final Score</div>
          </div>
          
          {/* ✅ XP EARNED DISPLAY */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-center text-green-600">
              <Award className="h-5 w-5 mr-2" />
              <span className="font-semibold">+{Math.round(percentage / 10)} XP Earned!</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetQuiz}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Retake Quiz
          </button>
        </div>

        {/* ✅ MOTIVATIONAL MESSAGE */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p className="text-sm text-gray-700">
            {percentage >= 80 ? 
              "Outstanding performance! You're mastering this topic! 🌟" :
              percentage >= 60 ?
              "Great effort! Review the explanations to improve further! 📚" :
              "Don't give up! Learning takes practice. Try again! 💪"
            }
          </p>
        </div>
      </motion.div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Knowledge Check</h2>
          <div className={`flex items-center rounded-lg px-3 py-1 ${
            timeLeft <= 10 ? 'bg-red-500/20 animate-pulse' : 'bg-white/20'
          }`}>
            <Clock className="h-4 w-4 mr-2" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2 mb-2">
          <motion.div 
            className="bg-white h-2 rounded-full"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-sm opacity-90">
          <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {currentQ.question}
        </h3>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswer === index 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedAnswer !== null
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Quiz;
