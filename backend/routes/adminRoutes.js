const express = require('express');
const router = express.Router();
const { approveReview, rejectReview, getPendingReviews, getInsights } = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

router.put('/reviews/:id/approve', protect, requireAdmin, approveReview);
router.put('/reviews/:id/reject', protect, requireAdmin, rejectReview);
router.get('/reviews', protect, requireAdmin, getPendingReviews);
router.get('/insights', protect, requireAdmin, getInsights);

module.exports = router;