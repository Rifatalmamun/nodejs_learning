const express = require('express');
const authController = require('../controllers/auth/auth');
const {body} = require('express-validator');
const User = require('../models/User');
const router = express.Router();

router.get('/signup', authController.signupPage);
router.post('/signup', 
    [
        body('name')
        .notEmpty()
        .withMessage('Please enter your name')
        .isLength({min: 3})
        .withMessage('Name min length is 3'),

        body('email', 'Please enter valid email!')
        .notEmpty()
        .isEmail()
        .custom((value, {req})=>{
            return User.findOne({email: value})
            .then(userExist => {
                if(userExist){
                  return Promise.reject(`${value} already used! Please use another email`);
                }
            })
        })
        .normalizeEmail(),

        body('password', 'Please enter a password with only numbers and text and at least 5 characters')
        .isLength({min: 6, max: 10})
        .isAlphanumeric()
        .trim(),

        body('confirmPassword')
        .custom((value, {req})=>{
            if(value !== req.body.password){
                throw new Error('Confirm password does not match');
            }
            return true;
        })
        .trim()
    ],
    authController.signup);

router.get('/login', authController.loginPage);
router.post('/login',
    [
        body('email', 'Please enter valid email!')
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        // .custom((value, {req})=>{
        //     return User.findOne({email: value})
        //     .then(userExist => {
        //         if(!userExist){
        //             return Promise.reject('No user found! please signup');
        //         }
        //     })
        // })
        ,

        body('password', 'Please enter a password with only numbers and text and at least 5 characters')
        .notEmpty()
        .isLength({min: 6, max: 10})
        .isAlphanumeric()
        .trim()
    ],
    authController.login);
router.post('/logout', authController.logout);

router.get('/reset-password-email', authController.resetPasswordEmailPage);
router.post('/reset-password-email', authController.resetPasswordEmail);

router.get('/reset-password-:token', authController.resetPasswordPage);
router.post('/reset-password', authController.resetPassword);


module.exports = {router};