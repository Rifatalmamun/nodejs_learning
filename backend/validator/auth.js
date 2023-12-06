const { body } = require('express-validator');
const User = require('../models/User');

const signup = [
    body('name','please provide valid name')
        .trim()
        .isLength({min: 5}).withMessage('name min length 5'),

    body('email','please provide valid email')
        .trim()
        .isEmail()
        .custom((value, {req}) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if(userDoc){
                        return Promise.reject('email already exists!');
                    }
                })
        })
        .normalizeEmail(),
    
    body('password','please provide valid password')
       .trim()
       .isLength({min: 5}).withMessage('password min length 5')
];

const userStatusUpdate = [
    body('status','status invalid')
        .trim()
        .not()
        .isEmpty()
]

module.exports = {signup, userStatusUpdate}