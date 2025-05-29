const dishModel = require('../models/dish.model');
const { AppError } = require('../utils/errorHandler');
const { PAGINATION } = require('../config/constants');

/**
 * Gets all dishes with optional filters and pagination
 */
const getAllDishes = async (req, res, next) => {
  try {
    // Parse and validate query parameters
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.min(
      Math.max(1, parseInt(req.query.limit)) || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    const sort = req.query.sort || 'name';
    const order = req.query.order === 'desc' ? 'desc' : 'asc';

    // Get dishes from model
    const { dishes, totalCount } = await dishModel.getAllDishes({
      ...req.query,
      page,
      limit,
      sort,
      order
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.min(page, totalPages || 1);

    res.json({
      success: true,
      count: dishes.length,
      pagination: {
        currentPage,
        totalPages,
        itemsPerPage: limit,
        totalItems: totalCount,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      },
      data: dishes
    });
  } catch (error) {
    next(new AppError('Failed to fetch dishes', 500));
  }
};
/**
 * Gets single dish by name
 */
const getDishByName = async (req, res, next) => {
  try {
    const dish = await dishModel.getDishByName(req.params.name);
    if (!dish) {
      throw new AppError('Dish not found', 404);
    }
    res.json({
      success: true,
      data: dish
    });
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Failed to fetch dish', 500));
  }
};

/**
 * Search dishes across multiple fields
 */
const searchDishes = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    const results = await dishModel.searchDishes(query);
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Search failed', 500));
  }
};

/**
 * Create a new dish
 */
const createDish = async (req, res, next) => {
  try {
    const newDish = await dishModel.createDish(req.body);
    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: newDish
    });
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Failed to create dish', 500));
  }
};

/**
 * Update an existing dish
 */
const updateDish = async (req, res, next) => {
  try {
    const updatedDish = await dishModel.updateDish(req.params.name, req.body);
    if (!updatedDish) {
      throw new AppError('Dish not found', 404);
    }
    res.json({
      success: true,
      message: 'Dish updated successfully',
      data: updatedDish
    });
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Failed to update dish', 500));
  }
};

/**
 * Delete a dish
 */
const deleteDish = async (req, res, next) => {
  try {
    const success = await dishModel.deleteDish(req.params.name);
    if (!success) {
      throw new AppError('Dish not found', 404);
    }
    res.status(200).json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Failed to delete dish', 500));
  }
};

/**
 * Suggests dishes based on available ingredients
 */
const suggestDishesByIngredients = async (req, res, next) => {
  try {
    const { ingredients, matchAll = true } = req.body;

    // Validate input
    if (!ingredients || !Array.isArray(ingredients)) {
      throw new AppError('Ingredients must be provided as an array', 400);
    }
    if (ingredients.length === 0) {
      throw new AppError('At least one ingredient is required', 400);
    }

    // Get matching dishes
    const possibleDishes = await dishModel.getDishesByIngredients(ingredients);

    res.json({
      success: true,
      message: 'Dish suggestions retrieved successfully',
      count: possibleDishes.length,
      data: possibleDishes,
      meta: {
        ingredientsUsed: ingredients,
        matchStrategy: matchAll ? 'ALL' : 'ANY',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Failed to get dish suggestions', 500));
  }
};

module.exports = {
  getAllDishes,
  getDishByName,
  searchDishes,
  createDish,
  updateDish,
  deleteDish,
  suggestDishesByIngredients
};