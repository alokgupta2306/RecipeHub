const express = require('express');
const router = express.Router();
const { toggleFavourite, getFavourites, updatePantry, whatCanICook } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/me/favourites/:recipeId', protect, toggleFavourite);
router.get('/me/favourites', protect, getFavourites);
router.put('/me/pantry', protect, updatePantry);
router.post('/what-can-i-cook', protect, whatCanICook);

module.exports = router;