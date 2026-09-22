const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  cuisine: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  dietTags: [String],
  ingredients: [{
    name: String,
    quantity: Number,
    unit: String
  }],
  steps: [{
    stepNo: Number,
    text: String
  }],
  prepTime: Number,
  cookTime: Number,
  totalTime: Number,
  servings: Number,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  nutrition: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
    fibre: Number
  },
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  viewCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'draft'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for search, filtering, and sorting
recipeSchema.index({ title: 'text', 'ingredients.name': 'text' });
recipeSchema.index({ 'ingredients.name': 1 }); // Multikey
recipeSchema.index({ tags: 1 }); // Multikey (kept separate from dietTags - Mongo forbids compound indexing two array fields)
recipeSchema.index({ dietTags: 1 }); // Multikey
recipeSchema.index({ cuisine: 1, totalTime: 1 }); // Compound
recipeSchema.index({ dietTags: 1, 'ratings.average': -1 }); // Compound (dietTags is the only array field here, ratings.average is not - this is fine)
recipeSchema.index({ 'ratings.average': -1 }); // Single field

module.exports = mongoose.model('Recipe', recipeSchema);