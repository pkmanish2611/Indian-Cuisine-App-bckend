const { getDishesData, saveDishesData } = require('../utils/dataLoader');
const { parseFilterParams } = require('../utils/validation');

const dishModel = () => {
    let dishes = [];
    let isInitialized = false;
    let dbConnection = null;

    const ALLOWED_FIELDS = [
        'name', 'ingredients', 'diet', 'prep_time', 'cook_time',
        'flavor_profile', 'course', 'state', 'region'
    ];

    const SORTABLE_FIELDS = [
        'name', 'prep_time', 'cook_time', 'state', 'region'
    ];

    // Initialize with loaded data
    const initialize = async () => {
        try {
            dishes = await getDishesData();
            isInitialized = true;
            return true;
        } catch (error) {
            throw new Error(`Model initialization failed: ${error.message}`);
        }
    };

    // Private filter function
    const applyFilters = (dishesToFilter, filters) => {
        return dishesToFilter.filter(dish => {
            return Object.entries(filters).every(([field, conditions]) => {
                if (typeof conditions === 'object') {
                    return Object.entries(conditions).every(([operator, value]) => {
                        const dishValue = dish[field];
                        switch (operator) {
                            case 'gte': return dishValue >= value;
                            case 'lte': return dishValue <= value;
                            case 'gt': return dishValue > value;
                            case 'lt': return dishValue < value;
                            case 'eq': return dishValue == value;
                            default: return true;
                        }
                    });
                }

                if (field === 'ingredients') {
                    const dishIngredients = dish.ingredients.split(',').map(i => i.trim().toLowerCase());
                    return dishIngredients.includes(conditions.toLowerCase());
                }
                return String(dish[field]).toLowerCase() === String(conditions).toLowerCase();
            });
        });
    };

    // Save to JSON helper
    const persistData = async () => {
        try {
            await saveDishesData(dishes);
            return true;
        } catch (error) {
            throw new Error(`Data persistence failed: ${error.message}`);
        }
    };

    // Public API
    return {
        initialize,

        connectDB: (connection) => {
            dbConnection = connection;
            isInitialized = true;
            return true;
        },

        // CREATE
        createDish: async (dishData) => {
            if (!isInitialized) await initialize();

            try {
                const newDish = {
                    name: dishData.name,
                    ingredients: dishData.ingredients,
                    diet: dishData.diet || 'unknown',
                    prep_time: dishData.prep_time || 0,
                    cook_time: dishData.cook_time || 0,
                    flavor_profile: dishData.flavor_profile || 'unknown',
                    course: dishData.course || 'unknown',
                    state: dishData.state || 'unknown',
                    region: dishData.region || 'unknown'
                };

                dishes.push(newDish);
                await persistData();
                return newDish;
            } catch (error) {
                throw new Error(`Dish creation failed: ${error.message}`);
            }
        },

        // READ
        getAllDishes: async ({ page = 1, limit = 10, sort = 'name', order = 'asc', ...query } = {}) => {
            if (!isInitialized) await initialize();

            try {
                
                if (dbConnection) {
                    // Future DB implementation placeholder
                }

                // Filter results
                const filters = parseFilterParams(query, ALLOWED_FIELDS);
                let results = [...dishes];

                if (Object.keys(filters).length > 0) {
                    results = applyFilters(results, filters);
                }

                // Sort results
                const sortField = SORTABLE_FIELDS.includes(sort) ? sort : 'name';
                const sortOrder = order === 'desc' ? -1 : 1;

                results.sort((a, b) => {
                    const valA = a[sortField];
                    const valB = b[sortField];

                    // Handle missing/undefined values
                    if (valA === undefined && valB === undefined) return 0;
                    if (valA === undefined) return 1 * sortOrder;
                    if (valB === undefined) return -1 * sortOrder;

                    // Numeric comparison
                    if (typeof valA === 'number' && typeof valB === 'number') {
                        return (valA - valB) * sortOrder;
                    }

                    // String comparison
                    return String(valA).localeCompare(String(valB)) * sortOrder;
                });

                // Apply pagination
                const totalCount = results.length;
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedResults = results.slice(startIndex, endIndex);

                return {
                    dishes: paginatedResults,
                    totalCount
                };
            } catch (error) {
                throw new Error(`Failed to get dishes: ${error.message}`);
            }
        },

        getDishByName: async (name) => {
            if (!isInitialized) await initialize();

            if (dbConnection) {
                // Future DB implementation
                // return await dbConnection.collection('dishes').findOne({ name });
            }

            return dishes.find(dish =>
                dish.name.toLowerCase() === name.toLowerCase()
            ) || null;
        },

        // UPDATE
        updateDish: async (name, updateData) => {
            if (!isInitialized) await initialize();

            try {
                const index = dishes.findIndex(d =>
                    d.name.toLowerCase() === name.toLowerCase()
                );

                if (index === -1) return null;

                dishes[index] = {
                    ...dishes[index],
                    ...updateData,
                    // Preserve original name if not being updated
                    name: updateData.name || dishes[index].name
                };

                await persistData();
                return dishes[index];
            } catch (error) {
                throw new Error(`Dish update failed: ${error.message}`);
            }
        },

        // DELETE
        deleteDish: async (name) => {
            if (!isInitialized) await initialize();

            try {
                const index = dishes.findIndex(d =>
                    d.name.toLowerCase() === name.toLowerCase()
                );

                if (index === -1) return false;

                dishes.splice(index, 1);
                await persistData();
                return true;
            } catch (error) {
                throw new Error(`Dish deletion failed: ${error.message}`);
            }
        },

        // Existing specialized methods
        getDishesByIngredients: async (ingredients) => {
            if (!isInitialized) await initialize();
            if (!ingredients?.length) return [];

            const normalizedInputIngredients = ingredients.map(ing =>
                ing.trim().toLowerCase().split(/\s+/)
            );

            return dishes.filter(dish => {
                const dishIngredients = dish.ingredients
                    .split(',')
                    .map(i => i.trim().toLowerCase())
                    .filter(i => i);

                if (dishIngredients.length !== ingredients.length) {
                    return false;
                }

                return normalizedInputIngredients.every(inputIngParts => {
                    return inputIngParts.some(part =>
                        dishIngredients.some(dishIng => dishIng.includes(part))
                    );
                });
            });
        },

        searchDishes: async (query) => {
            if (!isInitialized) await initialize();
            if (!query) return [];

            const lowerQuery = query.toLowerCase();
            return dishes.filter(dish =>
                dish.name.toLowerCase().includes(lowerQuery) ||
                dish.ingredients.toLowerCase().includes(lowerQuery) ||
                dish.state?.toLowerCase().includes(lowerQuery) ||
                dish.region?.toLowerCase().includes(lowerQuery)
            );
        }
    };
};

module.exports = dishModel();