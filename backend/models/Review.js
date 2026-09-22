const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Empty for imported dataset
  reviewerName: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Partial unique index: one review per user per recipe (ignores dataset reviews without user)
reviewSchema.index(
  { user: 1, recipe: 1 }, 
  { unique: true, partialFilterExpression: { user: { $exists: true } } }
);
// Compound index for fetching approved reviews fast
reviewSchema.index({ recipe: 1, status: 1 });

module.exports = mongoose.model('Review', reviewSchema);