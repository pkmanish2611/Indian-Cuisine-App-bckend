const jwt = require('jsonwebtoken');
const { JWT } = require('../config/constants');
const { AppError } = require('../utils/errorHandler');

/**
 * Middleware to authenticate JWT token and attach user to request
 */
const authenticate = (req, res, next) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError('Authorization header is required', 401));
  }

  // Extract token from Bearer scheme
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return next(new AppError('Authorization format is "Bearer <token>"', 401));
  }

  const token = tokenParts[1];
  if (!token) {
    return next(new AppError('Authentication token is required', 401));
  }

  // Verify token
  jwt.verify(token, JWT.SECRET, (err, decoded) => {
    if (err) {
      let errorMessage = 'Invalid token';
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired';
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token signature';
      }
      return next(new AppError(errorMessage, 401));
    }

    // Attach user to request
    req.user = decoded;
    next();
  });
};

/**
 * Middleware factory to authorize based on user roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists on request
      if (!req.user) {
        throw new AppError('User not authenticated', 403);
      }

      // Check if user has role
      if (!req.user.role) {
        throw new AppError('User role not found', 403);
      }

      // Check if user has one of the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticate,
  authorize
};