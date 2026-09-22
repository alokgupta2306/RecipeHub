const Activity = require('../models/Activity');

// @route   GET /api/activity/recent
const getRecentActivity = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10).populate('recipe', 'title');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getRecentActivity };