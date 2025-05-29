/**
 * Utility functions for request validation and parameter parsing
 */

/**
 * Checks if value is a valid number
 */
const isValidNumber = (value) => {
  return value !== undefined && value !== null && !isNaN(Number(value));
};

/**
 * Parses LHS bracket notation filters from query parameters
 */
const parseFilterParams = (query, allowedFields = []) => {
  const filters = {};

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }

    const bracketMatch = key.match(/^(\w+)\[(\w+)\]$/);

    if (bracketMatch) {
      const [_, field, operator] = bracketMatch;

      if (allowedFields.includes(field)) {
        if (!filters[field]) filters[field] = {};
        if (['gte', 'lte', 'gt', 'lt', 'eq'].includes(operator)) {
          if (!isNaN(value)) {
            filters[field][operator] = Number(value);
          }
        }
      }
    } else if (allowedFields.includes(key)) {
      filters[key] = value;
    }
  }

  return filters;
};


module.exports = {
  isValidNumber,
  parseFilterParams
};