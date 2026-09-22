const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  days: [{
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    title: String,     // Snapshot pattern
    calories: Number,  // Snapshot pattern
    mealType: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);