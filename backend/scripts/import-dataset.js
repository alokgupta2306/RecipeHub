const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const connectDB = require('../config/db');

// Fail fast with a clear message instead of letting mongoose throw a cryptic error
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set. Check that backend/.env exists and contains a line like:');
  console.error('MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/recipehub');
  process.exit(1);
}

// Helper to safely parse python-style string arrays from the CSV
const parseStringArray = (str) => {
  try {
    return JSON.parse(str.replace(/'/g, '"'));
  } catch (e) {
    return [];
  }
};

// Helper to normalize ingredients (lowercase, trim, simple singularization)
const normalizeIngredient = (name) => {
  let cleanName = name.toLowerCase().trim();
  if (cleanName.endsWith('s') && !cleanName.endsWith('ss')) {
    cleanName = cleanName.slice(0, -1);
  }
  return cleanName;
};

const importRecipes = async () => {
  await connectDB();

  let batch = [];
  let count = 0;
  const MAX_RECIPES = 50000; // Target a smaller subset for the 512MB Atlas free tier limit

  const csvPath = path.join(__dirname, '..', 'data', 'recipes.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    console.error('Make sure recipes.csv is placed in backend/data/');
    process.exit(1);
  }

  const readStream = fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', async (row) => {
      if (count >= MAX_RECIPES) {
        readStream.destroy();
        return;
      }

      // Skip malformed rows with no name
      if (!row.name) return;

      // 1. Transform tags
      const tags = parseStringArray(row.tags);

      // Derive cuisine and diet tags
      const cuisinesList = ['indian', 'italian', 'mexican', 'chinese', 'french', 'american', 'thai'];
      const cuisine = tags.find(t => cuisinesList.includes(t)) || 'other';
      const dietTags = tags.filter(t => ['vegetarian', 'vegan', 'gluten-free', 'low-calorie', 'high-protein'].includes(t));

      // 2. Transform ingredients into embedded objects
      const rawIngredients = parseStringArray(row.ingredients);
      const ingredients = rawIngredients.map(ing => ({
        name: normalizeIngredient(ing),
        quantity: 1, // Dataset lacks exact quantities per ingredient line, defaulting to 1
        unit: 'piece'
      }));

      // 3. Transform steps
      const rawSteps = parseStringArray(row.steps);
      const steps = rawSteps.map((text, idx) => ({ stepNo: idx + 1, text }));

      // 4. Transform nutrition
      // Format: [calories (#), total fat (PDV), sugar (PDV), sodium (PDV), protein (PDV), saturated fat (PDV), carbohydrates (PDV)]
      const rawNutrition = parseStringArray(row.nutrition);
      const nutrition = {
        calories: rawNutrition[0] || 0,
        fat: rawNutrition[1] || 0,
        protein: rawNutrition[4] || 0,
        carbs: rawNutrition[6] || 0,
        fibre: 0 // Dataset doesn't explicitly separate fibre in the main 7 array
      };

      const recipe = {
        title: row.name,
        slug: `${row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${row.id}`,
        description: row.description,
        cuisine,
        tags,
        dietTags,
        ingredients,
        steps,
        prepTime: parseInt(row.minutes) || 0,
        totalTime: parseInt(row.minutes) || 0,
        nutrition,
        status: 'active'
      };

      batch.push(recipe);
      count++;

      // Insert in batches of 1000
      if (batch.length === 1000) {
        readStream.pause();
        try {
          await Recipe.insertMany(batch, { ordered: false });
          console.log(`Inserted ${count} recipes...`);
        } catch (error) {
          console.error('Batch insert failed:', error.message);
        }
        batch = [];
        readStream.resume();
      }
    })
    .on('end', async () => {
      if (batch.length > 0) {
        try {
          await Recipe.insertMany(batch, { ordered: false });
        } catch (error) {
          console.error('Final batch insert failed:', error.message);
        }
        console.log(`Inserted final batch. Total: ${count}`);
      }
      console.log('Recipe import complete.');
      process.exit();
    })
    .on('error', (err) => {
      console.error('Stream error:', err.message);
      process.exit(1);
    });
};

importRecipes();