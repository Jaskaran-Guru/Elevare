import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, Filter, Search, ArrowLeft, LogOut, Brain, Loader, Play, FileText, Star, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LearningPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [learningResources, setLearningResources] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  // Sample content data
  const sampleContent = [
    // ACADEMIC COURSES
    { _id: '1', title: "Introduction to Physics - Motion", description: "Learn the basics of motion, velocity, and acceleration. Perfect for 11th grade science students.", category: "academic", grade: "11th", stream: "science", content: { duration: 15 }, difficulty: "beginner", xpReward: 15, progress: null, subject: "Physics" },
    { _id: '2', title: "Basic Mathematics - Algebra", description: "Master fundamental algebraic concepts and equations. Foundation for advanced mathematics.", category: "academic", grade: "10th", stream: "all", content: { duration: 25 }, difficulty: "beginner", xpReward: 18, progress: null, subject: "Mathematics" },
    { _id: '3', title: "Intermediate Mathematics - Calculus", description: "Master calculus concepts including derivatives and integrals for 12th grade students.", category: "academic", grade: "12th", stream: "science", content: { duration: 25 }, difficulty: "intermediate", xpReward: 20, progress: null, subject: "Mathematics" },
    { _id: '4', title: "Chemistry - Chemical Bonding", description: "Understand chemical bonding, molecular structures and periodic trends.", category: "academic", grade: "11th", stream: "science", content: { duration: 30 }, difficulty: "intermediate", xpReward: 22, progress: null, subject: "Chemistry" },
    { _id: '5', title: "Advanced Chemistry - Organic Reactions", description: "Deep dive into complex organic chemistry reactions and mechanisms.", category: "academic", grade: "12th", stream: "science", content: { duration: 30 }, difficulty: "advanced", xpReward: 25, progress: null, subject: "Chemistry" },
    { _id: '6', title: "Advanced Physics - Quantum Mechanics", description: "Explore quantum mechanics and advanced physics concepts for competitive exams.", category: "academic", grade: "12th", stream: "science", content: { duration: 40 }, difficulty: "advanced", xpReward: 30, progress: null, subject: "Physics" },
    { _id: '7', title: "JEE Physics Mastery", description: "Expert-level physics for JEE Advanced preparation.", category: "academic", grade: "12th", stream: "science", content: { duration: 50 }, difficulty: "expert", xpReward: 40, progress: null, subject: "Physics" },
    { _id: '8', title: "IIT-JEE Mathematics", description: "Competitive exam level mathematics problems and techniques.", category: "academic", grade: "12th", stream: "science", content: { duration: 45 }, difficulty: "competitive", xpReward: 35, progress: null, subject: "Mathematics" },

    // SOFT SKILLS COURSES
    { _id: '9', title: "Time Management for Students", description: "Essential skills for managing your study time effectively. Applicable for all students.", category: "soft-skills", grade: "all", stream: "all", content: { duration: 10 }, difficulty: "beginner", xpReward: 10, progress: null, subject: "Life Skills" },
    { _id: '10', title: "Basic Study Techniques", description: "Learn fundamental study methods and note-taking strategies for better learning.", category: "soft-skills", grade: "all", stream: "all", content: { duration: 15 }, difficulty: "beginner", xpReward: 12, progress: null, subject: "Study Skills" },
    { _id: '11', title: "Communication Skills Workshop", description: "Develop professional communication and presentation skills for career success.", category: "soft-skills", grade: "all", stream: "all", content: { duration: 20 }, difficulty: "intermediate", xpReward: 15, progress: null, subject: "Communication" },
    { _id: '12', title: "Leadership Skills Development", description: "Build leadership qualities and team management skills for future success.", category: "soft-skills", grade: "college", stream: "all", content: { duration: 25 }, difficulty: "intermediate", xpReward: 18, progress: null, subject: "Leadership" }
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'academic', label: '📚 Academic' },
    { value: 'soft-skills', label: '🧠 Soft Skills' },
    { value: 'career-guidance', label: '🎯 Career Guidance' },
    { value: 'current-affairs', label: '📰 Current Affairs' },
    { value: 'language-learning', label: '🌐 Language Learning' },
    { value: 'coding-programming', label: '💻 Coding & Programming' },
    { value: 'assessment-tests', label: '📝 Assessment & Tests' },
    { value: 'vocational-skills', label: '🔧 Vocational Skills' },
    { value: 'creative-arts', label: '🎨 Creative Arts' },
    { value: 'financial-literacy', label: '💰 Financial Literacy' },
    { value: 'health-fitness', label: '💪 Health & Fitness' }
  ];

  const difficulties = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: '🟢 Beginner' },
    { value: 'intermediate', label: '🟡 Intermediate' },
    { value: 'advanced', label: '🔴 Advanced' },
    { value: 'expert', label: '⭐ Expert' },
    { value: 'competitive', label: '🏆 Competitive' }
  ];

  // ✅ ENHANCED: Crash-proof AI Resource Fetching with Retry Logic
const fetchAIResources = async (topic) => {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`🎯 Attempt ${attempt} - Starting AI resource fetch for:`, topic.title);
      
      const requestData = {
        topic: topic.title,
        subject: topic.subject || 'General',
        grade: user?.grade || '11th',
        stream: user?.stream || 'science',
        difficulty: topic.difficulty,
        userId: user?._id
      };

      console.log('📤 Request data:', requestData);

      // ✅ CORS-Compatible Fetch Configuration
      const response = await fetch('http://localhost:5000/api/ai/generate-learning-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          // ❌ DO NOT set Origin header manually - browser sets it
        },
        credentials: 'include', // ✅ CRITICAL for CORS with auth
        body: JSON.stringify(requestData)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 CORS Headers:', {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not OK:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Success response received');

      if (data.success && data.resources) {
        toast.success('🎉 AI resources generated successfully!');
        return data.resources;
      } else if (data.fallbackContent) {
        toast.warn('⚠️ Using fallback content');
        return data.fallbackContent;
      } else {
        throw new Error(data.message || 'No resources received');
      }
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt >= maxRetries) {
        const errorMessage = error.message.includes('NetworkError') || error.message.includes('Failed to fetch')
          ? 'CORS error - server CORS configuration issue'
          : error.message;
        throw new Error(errorMessage);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};


  // ✅ USER PROGRESS TRACKING FUNCTION
const trackUserProgress = async (contentData, progressData) => {
  try {
    if (!user?._id) return;
    
    console.log('📊 Tracking user progress for:', contentData.title);
    
    // ✅ FIXED: Added credentials and consistent URL
    const response = await fetch('http://localhost:5000/api/progress/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // ✅ CRITICAL FIX!
      body: JSON.stringify({
        userId: user._id,
        contentId: contentData._id || 'ai-content-' + Date.now(),
        status: progressData.status || 'in_progress',
        completionPercentage: progressData.completionPercentage || 0,
        score: progressData.score || 5,
        timeSpent: progressData.timeSpent || 1,
        aiResourcesData: progressData.aiResourcesData
      })
    });

    if (response.ok) {
      const result = await response.json(); // ✅ Added response parsing
      console.log('✅ User progress tracked successfully:', result);
    } else {
      console.warn('⚠️ Progress tracking failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Failed to track progress (non-critical):', error);
  }
};


  // ✅ MAIN CONTENT CLICK HANDLER (Single, consolidated version)
  const handleContentClick = async (contentItem) => {
    setLoading(true);
    setSelectedTopic(contentItem);
    
    try {
      toast.loading('AI आपके लिए complete study materials generate कर रहा है...', {
        duration: 3000
      });

      // Generate AI resources
      const resources = await fetchAIResources(contentItem);
      
      if (resources) {
        setLearningResources(resources);
        toast.dismiss();
        
        // ✅ TRACK USER PROGRESS AUTOMATICALLY
        await trackUserProgress(contentItem, {
          status: 'in_progress',
          completionPercentage: 10,
          score: 10, // Award XP for starting learning
          timeSpent: 2,
          aiResourcesData: {
            topic: contentItem.title,
            subject: contentItem.subject,
            difficulty: contentItem.difficulty,
            resourcesGenerated: new Date(),
            isFallback: resources.metadata?.isFallback || false
          }
        });
        
        // Different messages based on content type
        if (resources.metadata?.isFallback) {
          toast.info('📚 Basic study material तैयार है और progress saved! Detailed content के लिए बाद में try करें');
        } else {
          toast.success('🎉 Complete AI study package तैयार है और progress saved!');
        }
      }
      
    } catch (error) {
      console.error('Content generation error:', error);
      toast.dismiss();
      
      // Show user-friendly error with retry option
      toast.error(error.message, {
        duration: 5000,
        action: {
          label: 'Retry',
          onClick: () => handleContentClick(contentItem)
        }
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  useEffect(() => {
    let filtered = [...sampleContent];

    if (user?.grade) {
      filtered = filtered.filter(item => 
        item.grade === user.grade || item.grade === 'all'
      );
    }

    if (user?.stream && user.stream !== 'all') {
      filtered = filtered.filter(item =>
        item.stream === user.stream || item.stream === 'all'
      );
    }

    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.difficulty && filters.difficulty !== '') {
      filtered = filtered.filter(item => item.difficulty === filters.difficulty);
    }

    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    }

    setContent(filtered);
  }, [user, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLogout = () => {
    logout();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return '📚';
      case 'soft-skills': return '🧠';
      case 'career-guidance': return '🎯';
      case 'current-affairs': return '📰';
      case 'language-learning': return '🌐';
      case 'coding-programming': return '💻';
      case 'assessment-tests': return '📝';
      case 'vocational-skills': return '🔧';
      case 'creative-arts': return '🎨';
      case 'financial-literacy': return '💰';
      case 'health-fitness': return '💪';
      default: return '📖';
    }
  };

  // ✅ DETAILED RESOURCE VIEW (When AI resources are generated)
  if (learningResources) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={() => {
                    setLearningResources(null);
                    setSelectedTopic(null);
                  }}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Learning Center
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Elevare
                </h1>
                <span className="ml-3 text-gray-600">AI Study Materials</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
                  <Award className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-blue-600 font-medium text-sm">
                    {user?.learningStats?.totalXP || user?.progress?.totalXP || 0} XP
                  </span>
                </div>
                <span className="text-sm text-gray-600">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* AI Generated Learning Resources */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Content Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center">
                    ✨ Complete AI Study Package
                    <span className="ml-3 text-sm bg-white/20 px-3 py-1 rounded-full">
                      {learningResources.metadata?.difficulty || 'Standard'} Level
                    </span>
                  </h2>
                  <p className="opacity-90">Topic: {selectedTopic?.title}</p>
                  <p className="text-sm opacity-75">
                    Time to Master: {learningResources.timeToMaster || '2-3 weeks'} | 
                    Generated: {new Date().toLocaleString()}
                  </p>
                  {learningResources.metadata?.isFallback && (
                    <p className="text-sm bg-yellow-500/20 px-2 py-1 rounded mt-2">
                      ⚠️ Basic Content Mode - For detailed AI content, try again later
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Summary */}
              {learningResources.summary && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    📝 Study Summary
                  </h3>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {learningResources.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Notes */}
              {learningResources.detailedNotes && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                    📚 Complete Study Notes
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                      {learningResources.detailedNotes}
                    </pre>
                  </div>
                </div>
              )}

              {/* Key Terms */}
              {learningResources.keyTerms && learningResources.keyTerms.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Star className="h-5 w-5 text-yellow-600 mr-2" />
                    🔑 Key Terms & Definitions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningResources.keyTerms.map((term, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-bold text-yellow-800 mb-2">{term.term}</h4>
                        <p className="text-gray-700 text-sm mb-2">{term.definition}</p>
                        {term.example && (
                          <p className="text-yellow-700 text-xs italic">Example: {term.example}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Problems */}
              {learningResources.practiceProblems && learningResources.practiceProblems.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 text-orange-600 mr-2" />
                    🎯 Practice Problems
                  </h3>
                  <div className="space-y-4">
                    {learningResources.practiceProblems.map((problem, index) => (
                      <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-orange-800">
                            Problem {index + 1}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3 bg-white p-3 rounded border">
                          {problem.question}
                        </p>
                        {problem.hints && problem.hints.length > 0 && (
                          <div className="mb-3">
                            <h5 className="font-semibold text-orange-800 mb-2">Hints:</h5>
                            <ul className="text-orange-700 text-sm space-y-1">
                              {problem.hints.map((hint, hintIndex) => (
                                <li key={hintIndex}>💡 {hint}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <h5 className="font-semibold text-orange-800 mb-2">Solution:</h5>
                          <pre className="text-orange-700 bg-white p-3 rounded border whitespace-pre-wrap font-sans text-sm">
                            {problem.solution}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Tips */}
              {learningResources.studyTips && learningResources.studyTips.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
                    💡 Study Tips
                  </h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <ul className="space-y-2">
                      {learningResources.studyTips.map((tip, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                          <span className="text-purple-600 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Progress Update Button */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-green-800 mb-2">📊 Update Your Progress</h4>
                    <p className="text-sm text-green-700">Mark your learning progress to track improvement</p>
                  </div>
                  <button
                    onClick={async () => {
                      await trackUserProgress(selectedTopic, {
                        status: 'completed',
                        completionPercentage: 100,
                        score: 25,
                        timeSpent: 30,
                        aiResourcesData: {
                          topic: selectedTopic.title,
                          completed: true,
                          completedAt: new Date()
                        }
                      });
                      toast.success('🎉 Progress updated! +25 XP earned!');
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Mark as Complete ✓
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ✅ DEFAULT VIEW - Learning Content Cards
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link 
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Elevare
              </h1>
              <span className="ml-3 text-gray-600">AI Learning Center</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
                <Award className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-blue-600 font-medium text-sm">
                  {user?.learningStats?.totalXP || user?.progress?.totalXP || 0} XP
                </span>
              </div>
              <span className="text-sm text-gray-600">{user?.name}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Learning Center</h1>
          <p className="text-gray-600">
            Complete study materials with AI-generated content for <span className="font-medium">{user?.grade} - {user?.stream || 'All streams'}</span>
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleContentClick(item)}
            >
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {getCategoryIcon(item.category)} {item.category.replace('-', ' ')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    item.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    item.difficulty === 'advanced' ? 'bg-red-100 text-red-800' :
                    item.difficulty === 'expert' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {item.difficulty}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {item.content.duration} min
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Award className="h-4 w-4 mr-1" />
                    {item.xpReward} XP
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContentClick(item);
                  }}
                  disabled={loading && selectedTopic?._id === item._id}
                >
                  {loading && selectedTopic?._id === item._id ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      AI Resources Generate कर रहा है...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Get AI Study Materials + Progress Tracking
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {content.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or check back later for new content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
