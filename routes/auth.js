const express = require('express');
const authController = require('../controllers/auth/auth');

const router = express.Router();

router.get('/login', authController.loginPage);
router.post('/login', authController.login);

module.exports = {router};