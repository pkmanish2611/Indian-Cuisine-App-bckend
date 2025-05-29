/**
 * Application constants and configuration
 */
module.exports = {

  NODE_ENV: process.env.NODE_ENV || 'development',
  // JWT configuration
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your-strong-secret-key-here',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
  },
  
  // Server configuration
  PORT: process.env.PORT || 3000,
  
  // User roles
  ROLES: {
    ADMIN: 'admin',
    USER: 'user'
  },
  
  // Data file path
  DATA_FILE: process.env.DATA_FILE || './data/indian_food.json',
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },
  
  // Dish defaults
  DISH: {
    MAX_PREP_TIME: 1200,
    MAX_COOK_TIME: 1200
  }
};