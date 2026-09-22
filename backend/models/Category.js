const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sortOrder: Number,
  image: String
});

module.exports = mongoose.model('Category', categorySchema);