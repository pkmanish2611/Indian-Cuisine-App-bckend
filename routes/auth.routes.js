const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validation.middleware');
const { loginValidationRules } = require('../validations/auth.validation');

router.post('/login', validate(loginValidationRules()), authController.login);

module.exports = router;