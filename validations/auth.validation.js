const { body } = require('express-validator');

/**
 * Validation rules for login
 */
const loginValidationRules = () => {
  return [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ];
};

module.exports = {
  loginValidationRules
};