import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, Brain, Award, Loader, FileText, ExternalLink, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LearningPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [topicInput, setTopicInput] = useState('');
  const [aiContent, setAiContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

 const handleAiGenerate = async () => {
  if (!topicInput.trim()) {
    toast.error('कृपया कोई topic लिखें');
    return;
  }

  setLoading(true);

  try {
    // First check if backend is running
    const healthCheck = await fetch('/api/health');
    if (!healthCheck.ok) {
      throw new Error('Backend server not running');
    }

    const response = await fetch('/api/ai/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId: user._id,
        topic: topicInput,
        grade: user.grade || '11th',
        stream: user.stream || 'science'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.success) {
      setAiContent(data.content);
      toast.success('🎉 AI ने content generate कर दिया!');
    } else {
      toast.error(`Generation failed: ${data.error}`);
    }

  } catch (error) {
    console.error('Full error:', error);
    
    if (error.message.includes('Backend server not running')) {
      toast.error('🚫 Backend server चालू नहीं है। Terminal check करें।');
    } else if (error.name === 'TypeError') {
      toast.error('🌐 Server से connection नहीं हो रहा। Port 5000 check करें।');
    } else {
      toast.error(`❌ Error: ${error.message}`);
    }
  } finally {
    setLoading(false);
  }
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
              <span className="ml-3 text-gray-600">AI Learning Center</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
                <Award className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-blue-600 font-medium text-sm">
                  {user?.progress?.totalXP || 0} XP
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Learning Center
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            बस अपना topic लिखें, AI तुरंत आपके लिए complete study material बना देगा!
          </p>
          <p className="text-gray-500">
            Grade: <span className="font-medium">{user?.grade || 'Not set'}</span> • 
            Stream: <span className="font-medium">{user?.stream || 'Not set'}</span>
          </p>
        </motion.div>

        {/* AI Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <Brain className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              कोई भी Topic लिखें
            </h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Study Topic (English या Hindi में लिखें)
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="जैसे: Motion in Physics, Photosynthesis, Chemical Bonding, Economics Supply and Demand, आदि..."
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              💡 Examples: "Newton's Laws of Motion", "Photosynthesis in Plants", "World War 2", "Indian Constitution"
            </p>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={handleAiGenerate}
            disabled={loading || !topicInput.trim()}
            className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 ${
              loading || !topicInput.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader className="h-6 w-6 animate-spin mr-3" />
                AI Content Generate कर रहा है...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Brain className="h-6 w-6 mr-3" />
                🤖 AI से Study Material Generate करें
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Generated Content Display */}
        {aiContent && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Content Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                ✨ AI-Generated Study Material
                <span className="ml-3 text-sm bg-white/20 px-3 py-1 rounded-full">
                  Ready to Study!
                </span>
              </h2>
              <p className="opacity-90">Topic: {topicInput}</p>
            </div>

            <div className="p-8">
              {/* Summary Section */}
              {aiContent.summary && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    📝 विषय का सारांश (Summary)
                  </h3>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {aiContent.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {aiContent.notes && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                    📚 Detailed Study Notes
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                        {aiContent.notes}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Resources Section */}
              {aiContent.resources && aiContent.resources.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <ExternalLink className="h-5 w-5 text-purple-600 mr-2" />
                    🔗 Learning Resources
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiContent.resources.map((resource, index) => (
                      <motion.a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        className="block p-4 border border-purple-200 rounded-lg hover:border-purple-500 hover:shadow-lg transition-all bg-purple-50"
                      >
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">
                            {resource.type === 'video' ? '🎥' : '📖'}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 line-clamp-2">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-purple-600 capitalize mt-1">
                              {resource.type} Resource
                            </p>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Topics */}
              {aiContent.topics && aiContent.topics.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 text-orange-600 mr-2" />
                    🎯 Key Concepts to Remember
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {aiContent.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-8 pb-8">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setTopicInput('');
                    setAiContent(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  🔄 Generate New Topic
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  🏠 Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        {!aiContent && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              💡 How to Use AI Learning
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">✍️ What to Write:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Any academic topic from your syllabus</li>
                  <li>• Scientific concepts and theories</li>
                  <li>• Historical events and periods</li>
                  <li>• Mathematical concepts</li>
                  <li>• Current affairs topics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">🎯 What AI Provides:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Detailed topic summary</li>
                  <li>• Comprehensive study notes</li>
                  <li>• YouTube video links</li>
                  <li>• Additional reading resources</li>
                  <li>• Key concepts to remember</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
