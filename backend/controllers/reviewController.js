const Review = require('../models/Review');
const Activity = require('../models/Activity');

// @desc    Submit a review (pending)
// @route   POST /api/recipes/:id/reviews
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipeId = req.params.id;

    const review = await Review.create({
      recipe: recipeId,
      user: req.user._id,
      reviewerName: req.user.name,
      rating,
      comment,
      status: 'pending' // Requires admin approval
    });

    // Log Activity[cite: 1]
    await Activity.create({
      firstName: req.user.name.split(' ')[0],
      city: req.user.city || 'Unknown',
      action: 'reviewed',
      recipe: recipeId
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this recipe' }); // Handle unique partial index[cite: 1]
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get approved reviews for a recipe
// @route   GET /api/recipes/:id/reviews
const getRecipeReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.id, status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getRecipeReviews, deleteReview };