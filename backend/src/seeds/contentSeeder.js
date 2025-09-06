const mongoose = require('mongoose');
const Content = require('../models/Content');
require('dotenv').config();

const sampleContent = [
  {
    title: "Introduction to Physics - Motion",
    description: "Learn the basics of motion, velocity, and acceleration",
    category: "academic",
    grade: "11th",
    stream: "science",
    type: "video",
    content: {
      text: "Understanding motion is fundamental to physics. In this module, we'll explore concepts of displacement, velocity, and acceleration.",
      videoUrl: "https://www.youtube.com/watch?v=example1",
      duration: 15,
      resources: ["Physics textbook Chapter 1", "Practice problems PDF"]
    },
    difficulty: "beginner",
    xpReward: 15,
    tags: ["physics", "motion", "kinematics"]
  },
  {
    title: "Time Management for Students",
    description: "Essential skills for managing your study time effectively",
    category: "soft-skills",
    grade: "all",
    stream: "all",
    type: "article",
    content: {
      text: "Time management is crucial for academic success. Learn proven techniques to organize your study schedule and improve productivity.",
      duration: 10,
      resources: ["Time management worksheet", "Daily planner template"]
    },
    difficulty: "beginner",
    xpReward: 10,
    tags: ["time-management", "productivity", "study-skills"]
  },
  {
    title: "Career Options After 12th Science",
    description: "Explore various career paths available for science students",
    category: "career-guidance",
    grade: "12th",
    stream: "science",
    type: "article",
    content: {
      text: "Science opens doors to numerous career opportunities. From engineering to medicine, research to technology - discover your path.",
      duration: 20,
      resources: ["Career guide PDF", "University brochures", "Entrance exam information"]
    },
    difficulty: "beginner",
    xpReward: 20,
    tags: ["career", "science", "higher-education"]
  },
  {
    title: "Current Affairs - Technology Trends 2025",
    description: "Stay updated with latest technology developments",
    category: "current-affairs",
    grade: "all",
    stream: "all",
    type: "article",
    content: {
      text: "Technology is rapidly evolving. Stay informed about AI, blockchain, and other emerging technologies shaping our future.",
      duration: 12,
      resources: ["Tech news digest", "Industry reports"]
    },
    difficulty: "intermediate",
    xpReward: 12,
    tags: ["technology", "current-affairs", "innovation"]
  },
  {
    title: "Basic Mathematics - Algebra",
    description: "Master fundamental algebraic concepts and equations",
    category: "academic",
    grade: "10th",
    stream: "all",
    type: "video",
    content: {
      text: "Algebra forms the foundation of advanced mathematics. Learn to solve equations and work with variables confidently.",
      videoUrl: "https://www.youtube.com/watch?v=example2",
      duration: 25,
      resources: ["Algebra practice sheets", "Formula reference card"]
    },
    difficulty: "beginner",
    xpReward: 18,
    tags: ["mathematics", "algebra", "equations"]
  }
];

const seedContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');

    // Insert sample content
    await Content.insertMany(sampleContent);
    console.log('Sample content seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding content:', error);
  }
};

seedContent();
