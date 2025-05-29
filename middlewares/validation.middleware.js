const { validationResult } = require('express-validator');

/**
 * Middleware to validate request using express-validator rules
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Extract error messages
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    
    res.status(400).json({ 
      errors: errorMessages 
    });
  };
};

module.exports = validate;