const express = require('express');
const router = express.Router();
const { createPlan, getMyPlans, updatePlan, deletePlan, getPlanNutrition } = require('../controllers/mealPlanController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createPlan);
router.route('/my').get(protect, getMyPlans);
router.route('/:id').put(protect, updatePlan).delete(protect, deletePlan);
router.get('/:id/nutrition', protect, getPlanNutrition);

module.exports = router;