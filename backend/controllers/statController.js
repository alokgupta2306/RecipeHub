const Recipe = require('../models/Recipe');
const Review = require('../models/Review');
const MealPlan = require('../models/MealPlan');

// @route   GET /api/stats/top-rated
// Accepts optional ?minCount= query param (defaults to 1 so it's testable on smaller datasets;
// raise to 50 in production once enough real reviews exist)
const getTopRated = async (req, res) => {
  try {
    const minCount = Number(req.query.minCount) || 1;
    const stats = await Recipe.aggregate([
      { $match: { 'ratings.count': { $gte: minCount }, status: 'active' } },
      { $sort: { 'ratings.average': -1 } },
      { $limit: 10 }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/stats/calories-by-cuisine
const getCaloriesByCuisine = async (req, res) => {
  try {
    const stats = await Recipe.aggregate([
      { $group: { _id: '$cuisine', avgCalories: { $avg: '$nutrition.calories' }, avgTime: { $avg: '$totalTime' } } },
      { $sort: { avgCalories: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/stats/common-ingredients
// Most frequently used ingredients across all active recipes
const getCommonIngredients = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const stats = await Recipe.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$ingredients' },
      { $group: { _id: '$ingredients.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/stats/time-buckets
// Recipe count grouped into cooking-time ranges (minutes)
const getCookingTimeBuckets = async (req, res) => {
  try {
    const stats = await Recipe.aggregate([
      { $match: { status: 'active' } },
      {
        $bucket: {
          groupBy: '$totalTime',
          boundaries: [0, 15, 30, 60, 120, 99999],
          default: 'unknown',
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/stats/popular-tags
const getPopularTags = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const stats = await Recipe.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/stats/active-reviewers
// Users who have submitted the most reviews (any status)
const getActiveReviewers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const stats = await Review.aggregate([
      { $match: { user: { $exists: true } } },
      { $group: { _id: '$user', reviewCount: { $sum: 1 }, avgRatingGiven: { $avg: '$rating' } } },
      { $sort: { reviewCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          reviewCount: 1,
          avgRatingGiven: 1,
          name: '$userDetails.name',
          email: '$userDetails.email'
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/stats/mealplan-totals
// Aggregate nutrition totals across every stored meal plan (all users)
const getMealPlanTotals = async (req, res) => {
  try {
    const stats = await MealPlan.aggregate([
      { $unwind: '$days' },
      {
        $lookup: {
          from: 'recipes',
          localField: 'days.recipe',
          foreignField: '_id',
          as: 'recipeDetails'
        }
      },
      { $unwind: '$recipeDetails' },
      {
        $group: {
          _id: null,
          totalPlans: { $addToSet: '$_id' },
          totalMeals: { $sum: 1 },
          totalCalories: { $sum: '$recipeDetails.nutrition.calories' },
          avgCaloriesPerMeal: { $avg: '$recipeDetails.nutrition.calories' }
        }
      },
      {
        $project: {
          _id: 0,
          totalPlans: { $size: '$totalPlans' },
          totalMeals: 1,
          totalCalories: 1,
          avgCaloriesPerMeal: 1
        }
      }
    ]);
    res.json(stats[0] || { totalPlans: 0, totalMeals: 0, totalCalories: 0, avgCaloriesPerMeal: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTopRated,
  getCaloriesByCuisine,
  getCommonIngredients,
  getCookingTimeBuckets,
  getPopularTags,
  getActiveReviewers,
  getMealPlanTotals
};