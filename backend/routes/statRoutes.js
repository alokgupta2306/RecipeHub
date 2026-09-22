const express = require('express');
const router = express.Router();
const {
  getTopRated,
  getCaloriesByCuisine,
  getCommonIngredients,
  getCookingTimeBuckets,
  getPopularTags,
  getActiveReviewers,
  getMealPlanTotals
} = require('../controllers/statController');

router.get('/top-rated', getTopRated);
router.get('/calories-by-cuisine', getCaloriesByCuisine);
router.get('/common-ingredients', getCommonIngredients);
router.get('/time-buckets', getCookingTimeBuckets);
router.get('/popular-tags', getPopularTags);
router.get('/active-reviewers', getActiveReviewers);
router.get('/mealplan-totals', getMealPlanTotals);

module.exports = router;