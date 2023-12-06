const express = require('express');
const authValidator = require('../validator/auth');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.put('/signup', authValidator.signup, authController.signup);
router.post('/login', authController.login);
router.get('/status', isAuth, authController.getUserStatus);
router.patch('/status', isAuth, authValidator.userStatusUpdate, authController.updateUserStatus);

module.exports = {router};