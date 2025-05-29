const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { handleErrors } = require('./utils/errorHandler');
const { NODE_ENV } = require('./config/constants');

/**
 * Express application setup
 * Configures middleware, routes, and error handling for the API
 */
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS with configuration
app.use(cors({
  origin: NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === 'development' ? 1000 : 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Logging middleware
if (NODE_ENV !== 'test') {
  app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Parse JSON bodies (with size limit)
app.use(bodyParser.json({
  limit: '10kb'
}));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10kb'
}));

// Serve static files for documentation
app.use('/api-docs', express.static('public'));

// API routes
app.use('/api', routes);

// Swagger documentation route
app.use('/api-docs', require('./routes/docs.route'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource ${req.originalUrl} was not found`,
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// Central error handler
app.use(handleErrors);

module.exports = app;