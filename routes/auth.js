const express = require('express');
const authController = require('../controllers/auth/auth');

const router = express.Router();

router.get('/login', authController.loginPage);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/signup', authController.signupPage);
router.post('/signup', authController.signup);

router.get('/reset-password-email', authController.resetPasswordEmailPage);
router.post('/reset-password-email', authController.resetPasswordEmail);

router.get('/reset-password-:token', authController.resetPasswordPage);
router.post('/reset-password', authController.resetPassword);


module.exports = {router};