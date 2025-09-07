import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, FileText, Brain, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SyllabusManager = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('11th');
  const [selectedStream, setSelectedStream] = useState('science');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample syllabus topics
  const syllabusTopics = {
    '11th': {
      'science': [
        { id: 1, title: 'Motion in Straight Line', subject: 'Physics' },
        { id: 2, title: 'Some Basic Concepts of Chemistry', subject: 'Chemistry' },
        { id: 3, title: 'Sets and Functions', subject: 'Mathematics' },
        { id: 4, title: 'Living World', subject: 'Biology' }
      ]
    }
  };

  const topics = syllabusTopics[selectedClass]?.[selectedStream] || [];

  // Generate content when user clicks topic
  const generateContent = async (topic) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          grade: selectedClass,
          stream: selectedStream,
          topic: topic.title,
          subject: topic.subject,
          userId: user._id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.content);
        toast.success('🎉 AI ने content तैयार कर दिया!');
      } else {
        toast.error('Content generate नहीं हुआ');
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('कुछ गलत हुआ। फिर try करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        🤖 AI-Powered Syllabus Learning
      </h1>

      {/* Class Stream Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Select Your Class & Stream</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="11th">11th Grade</option>
            <option value="12th">12th Grade</option>
          </select>
          
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="science">Science</option>
            <option value="commerce">Commerce</option>
          </select>
        </div>
      </div>

      {/* Topics List */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">📚 Syllabus Topics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => generateContent(topic)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer"
            >
              <h3 className="font-semibold">{topic.title}</h3>
              <p className="text-gray-600 text-sm">{topic.subject}</p>
              <p className="text-blue-600 text-xs mt-2">
                👆 Click for AI-generated notes & resources
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <Loader className="h-6 w-6 animate-spin text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-800">
                AI आपके लिए content बना रहा है...
              </h3>
              <p className="text-blue-600 text-sm">
                कुछ seconds wait करें
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Content Display */}
      {generatedContent && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
            <h2 className="text-2xl font-bold">✨ AI-Generated Study Material</h2>
          </div>

          <div className="p-6">
            {/* Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                📝 Summary
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{generatedContent.summary}</p>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                📚 Study Notes
              </h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                  {generatedContent.notes}
                </pre>
              </div>
            </div>

            {/* YouTube Resources */}
            {generatedContent.resources && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <Play className="h-5 w-5 text-red-600 mr-2" />
                  🎥 Video Resources
                </h3>
                <div className="space-y-3">
                  {generatedContent.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50"
                    >
                      <div className="flex items-center">
                        <Play className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-gray-800">{resource.title}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Key Topics */}
            {generatedContent.topics && (
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <Brain className="h-5 w-5 text-purple-600 mr-2" />
                  🎯 Key Concepts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SyllabusManager;
