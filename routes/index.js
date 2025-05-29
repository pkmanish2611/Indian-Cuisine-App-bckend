const express = require('express');
const router = express.Router();
const dishesRoutes = require('./dishes.routes');
const authRoutes = require('./auth.routes');
const docsRoutes = require('./docs.route');

// API routes
router.use('/dishes', dishesRoutes);
router.use('/auth', authRoutes);

// Documentation route
router.use('/docs', docsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    docs: `${req.protocol}://${req.get('host')}/api/docs`
  });
});

module.exports = router;