const express = require('express');
const router = express.Router();
const dishesController = require('../controllers/dishes.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { 
  getDishFiltersValidationRules, 
  getIngredientsValidationRules,
  validateDishCreate,
  validateDishUpdate
} = require('../validations/dishes.validation');

// Public endpoints
router.get('/', validate(getDishFiltersValidationRules()), dishesController.getAllDishes);
router.get('/search', dishesController.searchDishes);
router.get('/:name', dishesController.getDishByName);

// Protected endpoints
router.post(
  '/suggestions/ingredients',
  authenticate,
  validate(getIngredientsValidationRules()),
  dishesController.suggestDishesByIngredients
);

// Admin-only endpoints
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateDishCreate(),
  dishesController.createDish
);

router.patch(
  '/:name',
  authenticate,
  authorize('admin'),
  validateDishUpdate(),
  dishesController.updateDish
);

router.delete(
  '/:name',
  authenticate,
  authorize('admin'),
  dishesController.deleteDish
);

module.exports = router;