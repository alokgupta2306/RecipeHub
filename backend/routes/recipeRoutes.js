const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeBySlug, createRecipe, updateRecipe, deleteRecipe, getFilterFacets, getRecipeTrend } = require('../controllers/recipeController');
const { addReview, getRecipeReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/').get(getRecipes).post(protect, createRecipe);
router.get('/facets', getFilterFacets);
router.get('/:id/trend', getRecipeTrend);
router.route('/:id/reviews').get(getRecipeReviews).post(protect, addReview);
router.route('/:slug').get(getRecipeBySlug);
router.route('/manage/:id').put(protect, updateRecipe).delete(protect, deleteRecipe);

module.exports = router;