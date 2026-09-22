require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Review = require('../models/Review');
const ViewStat = require('../models/ViewStat');

const seedData = async () => {
  await connectDB();
  console.log('Starting data generation...');

  // 1. Generate users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  const users = [
    { name: 'Alice Smith', email: 'alice@example.com', password: hashedPassword, role: 'user', city: 'London' },
    { name: 'Bob Jones', email: 'bob@example.com', password: hashedPassword, role: 'user', city: 'New York' },
    { name: 'Admin User', email: 'admin@recipehub.com', password: hashedPassword, role: 'admin', city: 'Chicago' }
  ];
  
  await User.deleteMany();
  const createdUsers = await User.insertMany(users);
  console.log('Users generated.');

  // 2. Attach interactions (reviews) to random recipes[cite: 1]
  // Grabbing 100 random recipes to seed data against
  const recipes = await Recipe.aggregate([{ $sample: { size: 100 } }]);
  
  const reviews = [];
  recipes.forEach(recipe => {
    const numReviews = Math.floor(Math.random() * 3) + 1; 
    for(let i = 0; i < numReviews; i++) {
       const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
       reviews.push({
         recipe: recipe._id,
         user: randomUser._id,
         reviewerName: randomUser.name,
         rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
         comment: 'This was amazing, followed the steps exactly!',
         status: 'approved'
       });
    }
  });
  
  await Review.deleteMany();
  await Review.insertMany(reviews);
  console.log(`Inserted ${reviews.length} reviews.`);

  // 3. Compute average ratings via aggregation[cite: 1]
  console.log('Calculating average ratings...');
  const ratingAgg = await Review.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$recipe', average: {$avg: '$rating' }, count: {$sum: 1 } } }
  ]);

  for (let stat of ratingAgg) {
    await Recipe.findByIdAndUpdate(stat._id, {
      ratings: { average: Math.round(stat.average * 10) / 10, count: stat.count }
    });
  }

  // 4. Fill viewstats with 30-day random trend data[cite: 1]
  console.log('Generating 30-day view trends for charts...');
  await ViewStat.deleteMany();
  const viewStats = [];
  const today = new Date();
  
  recipes.forEach(recipe => {
    for(let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Ensure time is zeroed out so the unique compound index (recipe + date) works correctly
      date.setHours(0, 0, 0, 0); 
      
      viewStats.push({
        recipe: recipe._id,
        date: date,
        views: Math.floor(Math.random() * 100) + 1
      });
    }
  });
  
  await ViewStat.insertMany(viewStats);
  console.log('Trend data generated.');

  console.log('Database seeding complete! You can now view the data in MongoDB Compass.');
  process.exit();
};

seedData();