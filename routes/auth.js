const express = require('express');
const authController = require('../controllers/auth/auth');
const authValidator = require('../validator/auth');

const router = express.Router();

router.get('/signup', authController.signupPage);
router.post('/signup', authValidator.signup, authController.signup);

router.get('/login', authController.loginPage);
router.post('/login', authValidator.login, authController.login);
router.post('/logout', authController.logout);

router.get('/reset-password-email', authController.resetPasswordEmailPage);
router.post('/reset-password-email', authController.resetPasswordEmail);

router.get('/reset-password-:token', authController.resetPasswordPage);
router.post('/reset-password', authController.resetPassword);


module.exports = {router};