const mongoose = require('mongoose');
const MealPlan = require('../models/MealPlan');
const Activity = require('../models/Activity');

const createPlan = async (req, res) => {
  try {
    const plan = await MealPlan.create({ ...req.body, user: req.user._id });
    await Activity.create({ firstName: req.user.name.split(' ')[0], city: req.user.city || 'Unknown', action: 'planned' });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id }).sort({ weekStart: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Meal plan deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlanNutrition = async (req, res) => {
  try {
    const nutrition = await MealPlan.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id), user: req.user._id } },
      { $unwind: '$days' },
      { $lookup: { from: 'recipes', localField: 'days.recipe', foreignField: '_id', as: 'recipeDetails' } },
      { $unwind: '$recipeDetails' },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$recipeDetails.nutrition.calories' },
          totalProtein: { $sum: '$recipeDetails.nutrition.protein' },
          totalCarbs: { $sum: '$recipeDetails.nutrition.carbs' }
        }
      }
    ]);
    res.json(nutrition[0] || { totalCalories: 0, totalProtein: 0, totalCarbs: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPlan, getMyPlans, updatePlan, deletePlan, getPlanNutrition };