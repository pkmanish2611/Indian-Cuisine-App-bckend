const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const YAML = require('yamljs');

// Load the YAML file directly
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Combine with JSDoc options if needed
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Indian Cuisine API',
      version: '1.0.0',
      description: 'API for exploring Indian cuisine dishes',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
  },
  apis: [
    path.join(__dirname, 'swagger.yaml'),
    path.join(__dirname, '../routes/*.js')
  ],
};

// Merge YAML documentation with JSDoc generated specs
const swaggerSpec = swaggerJsdoc(options);
const mergedSpec = {
  ...swaggerDocument,
  ...swaggerSpec,
  paths: {
    ...swaggerDocument.paths,
    ...swaggerSpec.paths,
  },
  components: {
    ...swaggerDocument.components,
    ...swaggerSpec.components,
  }
};

module.exports = mergedSpec;