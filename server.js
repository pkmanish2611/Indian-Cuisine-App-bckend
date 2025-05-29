require('dotenv').config();
const app = require('./app');
const { PORT } = require('./config/constants');
const { loadDishesData } = require('./utils/dataLoader');
const dishModel = require('./models/dish.model');

const startServer = async () => {
  try {
    console.log('Starting server initialization...');
    
    // 1. Load data
    const dishes = await loadDishesData();
    console.log('Data loaded successfully');
    
    // 2. Initialize model
    dishModel.initialize(dishes);
    console.log('Model initialized');
    
    // 3. Verify initialization
    const testData = await dishModel.getAllDishes();
    console.log(`Model test returned ${testData.length} dishes`);
    
    // 4. Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Try accessing: http://localhost:${PORT}/api/dishes`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();