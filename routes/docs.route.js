const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger/setup');

const router = express.Router();

// Serve Swagger UI at /api-docs
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'Indian Cuisine API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
  customfavIcon: '/public/favicon.ico',
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
  }
}));

module.exports = router;