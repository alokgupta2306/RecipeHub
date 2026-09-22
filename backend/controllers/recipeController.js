const Recipe = require('../models/Recipe');
const ViewStat = require('../models/ViewStat');

const getRecipes = async (req, res) => {
  try {
    const { search, cuisine, diet, maxTime, minRating, sort, page } = req.query;
    let query = { status: 'active' };

    if (search) query.$text = { $search: search };
    if (cuisine) query.cuisine = cuisine;
    if (diet) query.dietTags = diet; 
    if (maxTime) query.totalTime = { $lte: Number(maxTime) };
    if (minRating) query['ratings.average'] = { $gte: Number(minRating) };

    const pageSize = 20;
    const currentPage = Number(page) || 1;
    const skip = pageSize * (currentPage - 1);

    let sortOption = { createdAt: -1 }; 
    if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    if (sort === 'time') sortOption = { totalTime: 1 };
    if (search) sortOption = { score: { $meta: 'textScore' } }; 

    const recipes = await Recipe.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(skip)
      .select('-steps -reviews'); 

    const total = await Recipe.countDocuments(query);

    res.json({ recipes, page: currentPage, pages: Math.ceil(total / pageSize), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeBySlug = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug, status: 'active' }).populate('author', 'name');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Recipe.findByIdAndUpdate(recipe._id, { $inc: { viewCount: 1 } });
    await ViewStat.findOneAndUpdate(
      { recipe: recipe._id, date: today },
      { $inc: { views: 1 } },
      { upsert: true }
    );

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user._id,
      slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    });
    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFilterFacets = async (req, res) => {
  try {
    const facets = await Recipe.aggregate([
      { $match: { status: 'active' } },
      {
        $facet: {
          cuisines: [{ $group: { _id: '$cuisine', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
          diets: [{ $unwind: '$dietTags' }, { $group: { _id: '$dietTags', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
          times: [{ $bucket: { groupBy: '$totalTime', boundaries: [0, 15, 30, 60, 120, 9999], default: 'Other', output: { count: { $sum: 1 } } } }]
        }
      }
    ]);
    res.json(facets[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecipeTrend = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const trends = await ViewStat.find({ recipe: req.params.id, date: { $gte: thirtyDaysAgo } }).sort({ date: 1 });
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecipes, getRecipeBySlug, createRecipe, updateRecipe, deleteRecipe, getFilterFacets, getRecipeTrend };