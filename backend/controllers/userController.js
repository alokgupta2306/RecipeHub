const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Activity = require('../models/Activity');

// @route   POST /api/users/me/favourites/:recipeId
const toggleFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.recipeId;
    
    const index = user.favourites.indexOf(recipeId);
    if (index > -1) {
      user.favourites.splice(index, 1);
    } else {
      user.favourites.push(recipeId);
      await Activity.create({
        firstName: user.name.split(' ')[0],
        city: user.city || 'Unknown',
        action: 'saved',
        recipe: recipeId
      });
    }
    await user.save();
    res.json(user.favourites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/users/me/favourites
const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favourites');
    res.json(user.favourites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/users/me/pantry
const updatePantry = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { pantry: req.body.pantry },
      { new: true }
    );
    res.json(user.pantry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/users/what-can-i-cook
const whatCanICook = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pantry = user.pantry.map(i => i.toLowerCase());

    const recipes = await Recipe.aggregate([
      { $match: { 'ingredients.name': { $in: pantry }, status: 'active' } },
      {
        $addFields: {
          matchCount: {
            $size: { $setIntersection: ['$ingredients.name', pantry] }
          },
          totalIngredients: { $size: '$ingredients' }
        }
      },
      {
        $addFields: { matchPercentage: { $multiply: [{ $divide: ['$matchCount', '$totalIngredients'] }, 100] } }
      },
      { $sort: { matchPercentage: -1 } },
      { $limit: 20 }
    ]);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { toggleFavourite, getFavourites, updatePantry, whatCanICook };