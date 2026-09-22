const express = require('express');
const router = express.Router();
const { addReview, getRecipeReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/recipe/:id').post(protect, addReview).get(getRecipeReviews);
router.route('/:id').delete(protect, deleteReview);

module.exports = router;