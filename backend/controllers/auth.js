const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {validationResult} = require('express-validator');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const {name, email, password} = req.body;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({message: 'user created successfully', userId: result._id});
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.login = (req, res, next) => {
    const {email, password} = req.body;
    let loadedUser;

    User.findOne({email: email})
        .then(user => {
            if(!user){
                const error = new Error('user with this email could not be found');
                error.statusCode = 401;
                throw error;
            }

            loadedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if(!isEqual){
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 
            'somesupersecretkey',
            { expiresIn: '1h'});
            res.status(200).json({token: token, userId: loadedUser._id.toString()});
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            if(!user){
                const error = new Error('user not found');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({status: user.status});
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
}

exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;

    console.log('newStatus: ', newStatus);
    console.log('req.userId: ', req.userId);

    User.findById(req.userId)
        .then(user => {
            if(!user){
                const error = new Error('user not found');
                error.statusCode = 404;
                throw error;
            }
            user.status = newStatus;
            return user.save();
        })
        .then(result => {
            res.status(200).json({message: 'User status updated'});
        })
        .catch(error => {
            if(!error.statusCode){
                error.statusCode = 500;
            }
            next(error);
        });
}