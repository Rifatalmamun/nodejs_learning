const {body} = require('express-validator');
const User = require('../models/User');

const signup = [
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
    .normalizeEmail({gmail_remove_dots: false}),

    body('password', 'Please enter a password with only numbers and text and at least 6 characters')
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
];

const login = [
    body('email', 'Please enter valid email!')
    .notEmpty()
    .isEmail()
    .normalizeEmail({gmail_remove_dots: false}),
    // .custom((value, {req})=>{
    //     return User.findOne({email: value})
    //     .then(userExist => {
    //         if(!userExist){
    //             return Promise.reject('No user found! please signup');
    //         }
    //     })
    // })

    body('password', 'Please enter a password with only numbers and text and at least 6 characters')
    .notEmpty()
    .isLength({min: 6, max: 10})
    .isAlphanumeric()
    .trim()
];

module.exports = {signup, login}

