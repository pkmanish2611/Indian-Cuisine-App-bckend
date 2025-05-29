const { query, body } = require('express-validator');

// Allowed diet types
const DIET_TYPES = ['vegetarian', 'non vegetarian'];

/**
 * Returns validation rules for dish filters
 */
const getDishFiltersValidationRules = () => [
  query('name').optional().isString().trim(),
  query('diet').optional().isIn(DIET_TYPES),
  query('state').optional().isString().trim(),
  query('region').optional().isString().trim(),
  query('flavor_profile').optional().isString().trim(),
  query('course').optional().isString().trim(),
  
  // Numeric filters
  query('prep_time[gte]').optional().isFloat({ min: 0 }),
  query('prep_time[lte]').optional().isFloat({ min: 0 }),
  query('cook_time[gte]').optional().isFloat({ min: 0 }),
  query('cook_time[lte]').optional().isFloat({ min: 0 })
];

/**
 * Returns validation rules for ingredients suggestion
 */
const getIngredientsValidationRules = () => [
  body('ingredients')
    .isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('ingredients.*')
    .isString().withMessage('Each ingredient must be a string')
    .notEmpty().withMessage('Ingredient cannot be empty')
    .trim()
];

/**
 * Validation rules for creating a dish
 */
const validateDishCreate = () => [
  body('name').notEmpty().withMessage('Dish name is required'),
  body('ingredients').notEmpty().withMessage('Ingredients are required'),
  body('diet').isIn(DIET_TYPES).withMessage(`Diet must be one of: ${DIET_TYPES.join(', ')}`),
  body('prep_time').optional().isString(),
  body('cook_time').optional().isString(),
  body('flavor_profile').optional().isString(),
  body('course').optional().isString(),
  body('state').optional().isString(),
  body('region').optional().isString()
];

/**
 * Validation rules for updating a dish
 */
const validateDishUpdate = () => [
  body('name').optional().notEmpty().withMessage('Dish name cannot be empty'),
  body('ingredients').optional().notEmpty().withMessage('Ingredients cannot be empty'),
  body('diet').optional().isIn(DIET_TYPES).withMessage(`Diet must be one of: ${DIET_TYPES.join(', ')}`),
  body('prep_time').optional().isString(),
  body('cook_time').optional().isString(),
  body('flavor_profile').optional().isString(),
  body('course').optional().isString(),
  body('state').optional().isString(),
  body('region').optional().isString()
];

module.exports = {
  getDishFiltersValidationRules,
  getIngredientsValidationRules,
  validateDishCreate,
  validateDishUpdate
};