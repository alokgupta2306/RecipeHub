require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Middleware
const { errorHandler } = require('./middleware/errorHandler');

// Import Routes[cite: 1]
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const statRoutes = require('./routes/statRoutes');
const activityRoutes = require('./routes/activityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Establish database connection[cite: 1]
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json());

// API Routes Mounted[cite: 1]
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'RecipeHub API is live.' });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Global Error Handler[cite: 1]
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});