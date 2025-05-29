const fs = require('fs').promises;
const path = require('path');
const { DATA_FILE } = require('../config/constants');

let dishesData = [];
let isDataLoaded = false;

const loadDishesData = async () => {
  try {
    if (isDataLoaded) return dishesData;
    
    const absolutePath = path.resolve(__dirname, '../', DATA_FILE);
    const fileContent = await fs.readFile(absolutePath, 'utf8');
    dishesData = JSON.parse(fileContent);
    
    // Basic data sanitization
    dishesData = dishesData.map(dish => ({
      ...dish,
      prep_time: Number(dish.prep_time) || 0,
      cook_time: Number(dish.cook_time) || 0,
      diet: dish.diet || 'unknown',
      flavor_profile: dish.flavor_profile || 'unknown',
      state: dish.state || 'unknown',
      region: dish.region || 'unknown'
    }));
    
    console.log(`Successfully loaded ${dishesData.length} dishes from JSON`);
    isDataLoaded = true;
    return dishesData;
  } catch (error) {
    console.error('JSON data loading failed:', error.message);
    throw error;
  }
};

const saveDishesData = async () => {
  try {
    const absolutePath = path.resolve(__dirname, '../', DATA_FILE);
    await fs.writeFile(absolutePath, JSON.stringify(dishesData, null, 2));
    console.log('Dishes data saved to JSON file');
    return true;
  } catch (error) {
    console.error('Error saving dishes data:', error.message);
    throw error;
  }
};

const getDishesData = () => {
  if (!isDataLoaded) {
    throw new Error('Data not loaded. Call loadDishesData() first');
  }
  return dishesData;
};

module.exports = {
  loadDishesData,
  getDishesData,
  saveDishesData
};