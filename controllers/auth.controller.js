const userModel = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');

/**
 * Handles user login
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      throw new AppError('Username and password are required', 400);
    }

    // Find user
    const user = await userModel.findByUsername(username);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await userModel.verifyPassword(user, password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = userModel.generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Login failed', 500));
  }
};

module.exports = {
  login
};