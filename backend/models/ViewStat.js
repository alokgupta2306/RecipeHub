const mongoose = require('mongoose');

const viewStatSchema = new mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  date: { type: Date, required: true },
  views: { type: Number, default: 1 }
});

// Unique compound counter per recipe per day
viewStatSchema.index({ recipe: 1, date: 1 }, { unique: true });
// TTL index: auto-delete view data after 90 days (7776000 seconds)
viewStatSchema.index({ date: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('ViewStat', viewStatSchema);