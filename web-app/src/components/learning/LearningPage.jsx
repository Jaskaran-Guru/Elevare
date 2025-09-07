import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, Filter, Search, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LearningPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // ✅ Hook moved inside component
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });

  // Complete sample content with ALL categories and difficulties covered
  const sampleContent = [
    // ACADEMIC COURSES
    { _id: '1', title: "Introduction to Physics - Motion", description: "Learn the basics of motion, velocity, and acceleration. Perfect for 11th grade science students.", category: "academic", grade: "11th", stream: "science", content: { duration: 15 }, difficulty: "beginner", xpReward: 15, progress: null },
    { _id: '2', title: "Basic Mathematics - Algebra", description: "Master fundamental algebraic concepts and equations. Foundation for advanced mathematics.", category: "academic", grade: "10th", stream: "all", content: { duration: 25 }, difficulty: "beginner", xpReward: 18, progress: null },
    { _id: '3', title: "Intermediate Mathematics - Calculus", description: "Master calculus concepts including derivatives and integrals for 12th grade students.", category: "academic", grade: "12th", stream: "science", content: { duration: 25 }, difficulty: "intermediate", xpReward: 20, progress: null },
    { _id: '4', title: "Chemistry - Chemical Bonding", description: "Understand chemical bonding, molecular structures and periodic trends.", category: "academic", grade: "11th", stream: "science", content: { duration: 30 }, difficulty: "intermediate", xpReward: 22, progress: null },
    { _id: '5', title: "Advanced Chemistry - Organic Reactions", description: "Deep dive into complex organic chemistry reactions and mechanisms.", category: "academic", grade: "12th", stream: "science", content: { duration: 30 }, difficulty: "advanced", xpReward: 25, progress: null },
    { _id: '6', title: "Advanced Physics - Quantum Mechanics", description: "Explore quantum mechanics and advanced physics concepts for competitive exams.", category: "academic", grade: "12th", stream: "science", content: { duration: 40 }, difficulty: "advanced", xpReward: 30, progress: null },
    { _id: '7', title: "JEE Physics Mastery", description: "Expert-level physics for JEE Advanced preparation.", category: "academic", grade: "12th", stream: "science", content: { duration: 50 }, difficulty: "expert", xpReward: 40, progress: null },
    { _id: '8', title: "IIT-JEE Mathematics", description: "Competitive exam level mathematics problems and techniques.", category: "academic", grade: "12th", stream: "science", content: { duration: 45 }, difficulty: "competitive", xpReward: 35, progress: null },

    // SOFT SKILLS COURSES
    { _id: '9', title: "Time Management for Students", description: "Essential skills for managing your study time effectively. Applicable for all students.", category: "soft-skills", grade: "all", stream: "all", content: { duration: 10 }, difficulty: "beginner", xpReward: 10, progress: null },
    { _id: '10', title: "Basic Study Techniques", description: "Learn fundamental study methods and note-taking strategies for better learning.", category: "soft-skills", grade: "all", stream: "all", content: { duration: 15 }, difficulty: "beginner", xpReward: 12, progress: null },
    { _id: '11', title: "Communication Skills Workshop", description: "Develop professional communication and presentation skills for career success.", category: "soft-skills", grade: "all", stream: "all", content: { duration: 20 }, difficulty: "intermediate", xpReward: 15, progress: null },
    { _id: '12', title: "Leadership Skills Development", description: "Build leadership qualities and team management skills for future success.", category: "soft-skills", grade: "college", stream: "all", content: { duration: 25 }, difficulty: "intermediate", xpReward: 18, progress: null },
    { _id: '13', title: "Advanced Public Speaking", description: "Master advanced public speaking techniques and overcome stage fright completely.", category: "soft-skills", grade: "college", stream: "all", content: { duration: 35 }, difficulty: "advanced", xpReward: 25, progress: null },
    { _id: '14', title: "Emotional Intelligence Mastery", description: "Develop high emotional intelligence for professional and personal success.", category: "soft-skills", grade: "all", stream: "all", content: { duration: 30 }, difficulty: "advanced", xpReward: 22, progress: null },

    // CAREER GUIDANCE COURSES
    { _id: '15', title: "Career Options After 12th Science", description: "Explore various career paths available for science students after completing 12th grade.", category: "career-guidance", grade: "12th", stream: "science", content: { duration: 20 }, difficulty: "beginner", xpReward: 15, progress: null },
    { _id: '16', title: "Introduction to Engineering Fields", description: "Overview of different engineering branches and career opportunities in each field.", category: "career-guidance", grade: "12th", stream: "science", content: { duration: 18 }, difficulty: "beginner", xpReward: 14, progress: null },
    { _id: '17', title: "Career Planning Strategies", description: "Strategic approach to career planning, goal setting and skill development roadmap.", category: "career-guidance", grade: "college", stream: "all", content: { duration: 22 }, difficulty: "intermediate", xpReward: 18, progress: null },
    { _id: '18', title: "Resume Building & Interview Skills", description: "Learn to create compelling resumes and ace job interviews with confidence.", category: "career-guidance", grade: "college", stream: "all", content: { duration: 28 }, difficulty: "intermediate", xpReward: 20, progress: null },
    { _id: '19', title: "Industry Networking & Professional Growth", description: "Advanced strategies for building professional networks and career advancement.", category: "career-guidance", grade: "graduate", stream: "all", content: { duration: 32 }, difficulty: "advanced", xpReward: 25, progress: null },
    { _id: '20', title: "Entrepreneurship & Startup Essentials", description: "Complete guide to starting your own business and entrepreneurial mindset.", category: "career-guidance", grade: "college", stream: "all", content: { duration: 45 }, difficulty: "advanced", xpReward: 35, progress: null },

    // CURRENT AFFAIRS COURSES
    { _id: '21', title: "Current Affairs - Monthly Digest", description: "Stay updated with important national and international news events of this month.", category: "current-affairs", grade: "all", stream: "all", content: { duration: 15 }, difficulty: "beginner", xpReward: 10, progress: null },
    { _id: '22', title: "Basic Economics Updates", description: "Simple explanation of current economic trends and policies affecting students.", category: "current-affairs", grade: "11th", stream: "commerce", content: { duration: 12 }, difficulty: "beginner", xpReward: 8, progress: null },
    { _id: '23', title: "Current Affairs - Technology Trends 2025", description: "Stay updated with latest technology developments and innovations shaping our future.", category: "current-affairs", grade: "all", stream: "all", content: { duration: 18 }, difficulty: "intermediate", xpReward: 15, progress: null },
    { _id: '24', title: "Environmental Issues & Climate Change", description: "Comprehensive analysis of current environmental challenges and global responses.", category: "current-affairs", grade: "12th", stream: "all", content: { duration: 20 }, difficulty: "intermediate", xpReward: 16, progress: null },
    { _id: '25', title: "Geopolitical Analysis & Global Relations", description: "Advanced analysis of international relations and their impact on India.", category: "current-affairs", grade: "college", stream: "all", content: { duration: 25 }, difficulty: "advanced", xpReward: 20, progress: null },
    { _id: '26', title: "Advanced Policy Analysis", description: "In-depth study of government policies and their socio-economic implications.", category: "current-affairs", grade: "graduate", stream: "all", content: { duration: 35 }, difficulty: "advanced", xpReward: 28, progress: null },

    // LANGUAGE LEARNING COURSES
    { _id: '27', title: "English Grammar Basics", description: "Basic English grammar rules and usage for beginners.", category: "language-learning", grade: "10th", stream: "all", content: { duration: 20 }, difficulty: "beginner", xpReward: 12, progress: null },
    { _id: '28', title: "French Conversation", description: "Intermediate French speaking and listening skills development.", category: "language-learning", grade: "11th", stream: "all", content: { duration: 25 }, difficulty: "intermediate", xpReward: 18, progress: null },
    { _id: '29', title: "Advanced Spanish Literature", description: "Advanced Spanish language and literature for arts students.", category: "language-learning", grade: "12th", stream: "arts", content: { duration: 30 }, difficulty: "advanced", xpReward: 25, progress: null },

    // CODING & PROGRAMMING COURSES
    { _id: '30', title: "Scratch Programming", description: "Visual programming for beginners using Scratch platform.", category: "coding-programming", grade: "10th", stream: "all", content: { duration: 20 }, difficulty: "beginner", xpReward: 15, progress: null },
    { _id: '31', title: "Python Web Development", description: "Build web applications using Python Django framework.", category: "coding-programming", grade: "12th", stream: "science", content: { duration: 35 }, difficulty: "intermediate", xpReward: 25, progress: null },
    { _id: '32', title: "Machine Learning Algorithms", description: "Advanced ML algorithms and their practical implementations.", category: "coding-programming", grade: "college", stream: "science", content: { duration: 45 }, difficulty: "advanced", xpReward: 35, progress: null },

    // ASSESSMENT & TESTS COURSES
    { _id: '33', title: "Class 10 Sample Papers", description: "Practice papers for class 10 board examinations.", category: "assessment-tests", grade: "10th", stream: "all", content: { duration: 90 }, difficulty: "beginner", xpReward: 20, progress: null },
    { _id: '34', title: "Class 12 Mock Tests", description: "Comprehensive mock tests for 12th board examinations.", category: "assessment-tests", grade: "12th", stream: "all", content: { duration: 120 }, difficulty: "intermediate", xpReward: 25, progress: null },
    { _id: '35', title: "JEE Advanced Papers", description: "Expert-level JEE Advanced practice papers with solutions.", category: "assessment-tests", grade: "12th", stream: "science", content: { duration: 200 }, difficulty: "advanced", xpReward: 40, progress: null },

    // VOCATIONAL SKILLS COURSES
    { _id: '36', title: "Computer Basics", description: "Basic computer operations and MS Office applications.", category: "vocational-skills", grade: "10th", stream: "all", content: { duration: 25 }, difficulty: "beginner", xpReward: 15, progress: null },
    { _id: '37', title: "Digital Marketing", description: "Learn social media marketing and digital advertising strategies.", category: "vocational-skills", grade: "college", stream: "commerce", content: { duration: 30 }, difficulty: "intermediate", xpReward: 22, progress: null },
    { _id: '38', title: "Advanced Excel & Analytics", description: "Advanced Excel functions and data analytics techniques.", category: "vocational-skills", grade: "college", stream: "commerce", content: { duration: 35 }, difficulty: "advanced", xpReward: 28, progress: null },

    // CREATIVE ARTS COURSES
    { _id: '39', title: "Music Fundamentals", description: "Basic music theory, rhythm and melody composition.", category: "creative-arts", grade: "all", stream: "all", content: { duration: 25 }, difficulty: "beginner", xpReward: 15, progress: null },
    { _id: '40', title: "Digital Art Creation", description: "Create stunning digital art using modern design software.", category: "creative-arts", grade: "11th", stream: "arts", content: { duration: 30 }, difficulty: "intermediate", xpReward: 20, progress: null },
    { _id: '41', title: "Advanced Photography", description: "Advanced photography techniques and professional composition.", category: "creative-arts", grade: "12th", stream: "arts", content: { duration: 35 }, difficulty: "advanced", xpReward: 25, progress: null },

    // FINANCIAL LITERACY COURSES
    { _id: '42', title: "Saving and Banking", description: "Learn about savings accounts and basic banking operations.", category: "financial-literacy", grade: "10th", stream: "all", content: { duration: 20 }, difficulty: "beginner", xpReward: 12, progress: null },
    { _id: '43', title: "Investment Basics", description: "Introduction to stocks, bonds, mutual funds and investment strategies.", category: "financial-literacy", grade: "12th", stream: "commerce", content: { duration: 25 }, difficulty: "intermediate", xpReward: 18, progress: null },
    { _id: '44', title: "Advanced Finance", description: "Advanced financial planning, analysis and portfolio management.", category: "financial-literacy", grade: "college", stream: "commerce", content: { duration: 30 }, difficulty: "advanced", xpReward: 25, progress: null },

    // HEALTH & FITNESS COURSES
    { _id: '45', title: "Exercise for Students", description: "Simple exercises and fitness routines for students to stay healthy.", category: "health-fitness", grade: "all", stream: "all", content: { duration: 18 }, difficulty: "beginner", xpReward: 12, progress: null },
    { _id: '46', title: "Nutrition and Diet", description: "Proper nutrition guidelines for growing teenagers and young adults.", category: "health-fitness", grade: "11th", stream: "all", content: { duration: 22 }, difficulty: "intermediate", xpReward: 15, progress: null },
    { _id: '47', title: "Advanced Fitness Training", description: "Advanced workout routines and professional training techniques.", category: "health-fitness", grade: "college", stream: "all", content: { duration: 30 }, difficulty: "advanced", xpReward: 22, progress: null }
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

  const handleContentClick = (contentItem) => {
    console.log("Button clicked! Navigating to:", `/content/${contentItem._id}`);
    navigate(`/content/${contentItem._id}`);
  };

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
              <span className="ml-3 text-gray-600">Learning Center</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
                <Award className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-blue-600 font-medium text-sm">
                  {user?.progress?.totalXP || 0} XP
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {user?.name}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Center</h1>
          <p className="text-gray-600">
            Personalized content for <span className="font-medium">{user?.grade} - {user?.stream || 'All streams'}</span>
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
                    <div className="bg-gray-200 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContentClick(item);
                  }}
                >
                  Start Learning
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
