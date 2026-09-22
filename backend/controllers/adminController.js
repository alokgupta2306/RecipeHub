const mongoose = require('mongoose');
const Review = require('../models/Review');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

const approveReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); 
  try {
    const review = await Review.findById(req.params.id).session(session);
    if (!review) throw new Error('Review not found');

    review.status = 'approved';
    await review.save({ session });

    const recipe = await Recipe.findById(review.recipe).session(session);
    const currentTotal = recipe.ratings.average * recipe.ratings.count;
    recipe.ratings.count += 1;
    recipe.ratings.average = (currentTotal + review.rating) / recipe.ratings.count;
    await recipe.save({ session });

    await session.commitTransaction(); 
    session.endSession();
    res.json({ message: 'Review approved and ratings updated' });
  } catch (error) {
    await session.abortTransaction(); 
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

const rejectReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review rejected', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' }).populate('recipe', 'title').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInsights = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const recipesCount = await Recipe.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: 'pending' });
    res.json({ usersCount, recipesCount, pendingReviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { approveReview, rejectReview, getPendingReviews, getInsights };