const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  city: String,
  pantry: [String],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  dietPreferences: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);