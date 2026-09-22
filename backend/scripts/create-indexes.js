require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import models
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Review = require('../models/Review');
const Category = require('../models/Category');
const MealPlan = require('../models/MealPlan');
const Activity = require('../models/Activity');
const ViewStat = require('../models/ViewStat');

const syncDatabaseIndexes = async () => {
  try {
    await connectDB();
    console.log('Forcing MongoDB to build all indexes...');

    await Recipe.createIndexes();
    console.log('- Recipe indexes created (Text, Multikey, Compound)');

    await User.createIndexes();
    console.log('- User indexes created (Unique Email)');

    await Review.createIndexes();
    console.log('- Review indexes created (Unique Partial, Compound)');

    await Category.createIndexes();
    console.log('- Category indexes created');

    await Activity.createIndexes();
    console.log('- Activity TTL index created');

    await ViewStat.createIndexes();
    console.log('- ViewStat TTL and Compound indexes created');

    console.log('All indexes built successfully!');
    process.exit();
  } catch (error) {
    console.error('Error creating indexes:', error.message);
    process.exit(1);
  }
};

syncDatabaseIndexes();