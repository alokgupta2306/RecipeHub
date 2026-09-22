const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  firstName: String,
  city: String,
  action: { type: String, enum: ['saved', 'reviewed', 'planned'] },
  recipeTitle: String,
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  createdAt: { type: Date, default: Date.now }
});

// TTL index: auto-delete old activity after 7 days (604800 seconds)
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('Activity', activitySchema);