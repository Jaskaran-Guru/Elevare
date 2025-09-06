const Content = require('../models/Content');
const Progress = require('../models/Progress');

// Get content for user's grade/stream
exports.getContent = async (req, res) => {
  try {
    const { grade, stream, category, limit = 20 } = req.query;
    const userId = req.user.id;

    const filter = {
      isPublished: true,
      $or: [
        { grade: grade },
        { grade: 'all' }
      ]
    };

    if (stream && stream !== 'all') {
      filter.$or.push(
        { stream: stream },
        { stream: 'all' }
      );
    }

    if (category) {
      filter.category = category;
    }

    const content = await Content.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get user progress for these content items
    const contentIds = content.map(item => item._id);
    const userProgress = await Progress.find({
      user: userId,
      content: { $in: contentIds }
    });

    // Merge content with progress
    const contentWithProgress = content.map(item => {
      const progress = userProgress.find(p => p.content.toString() === item._id.toString());
      return {
        ...item.toObject(),
        progress: progress || null
      };
    });

    res.json({
      success: true,
      count: contentWithProgress.length,
      data: contentWithProgress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single content item
exports.getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Get user progress
    const progress = await Progress.findOne({
      user: userId,
      content: id
    });

    res.json({
      success: true,
      data: {
        ...content.toObject(),
        progress: progress || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { completionPercentage, timeSpent, status, score } = req.body;
    const userId = req.user.id;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    let progress = await Progress.findOne({
      user: userId,
      content: contentId
    });

    if (!progress) {
      progress = new Progress({
        user: userId,
        content: contentId
      });
    }

    // Update progress fields
    if (completionPercentage !== undefined) {
      progress.completionPercentage = completionPercentage;
    }
    if (timeSpent !== undefined) {
      progress.timeSpent += timeSpent;
    }
    if (status) {
      progress.status = status;
    }
    if (score !== undefined) {
      progress.score = score;
    }

    progress.lastAccessed = new Date();

    // If completed, award XP
    if (status === 'completed' && !progress.completedAt) {
      progress.completedAt = new Date();
      progress.xpEarned = content.xpReward;
      
      // Update user's total XP
      const User = require('../models/User');
      await User.findByIdAndUpdate(userId, {
        $inc: { 'progress.totalXP': content.xpReward }
      });
    }

    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
