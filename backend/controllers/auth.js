const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    try {
        if (!errors.isEmpty()) {
            const error = new Error('signup validation failed');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        const response = await user.save();

        res.status(201).json({ message: 'user created successfully', userId: response._id });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            const error = new Error('user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }

        const isEqualPassword = await bcrypt.compare(password, user.password);

        if (!isEqualPassword) {
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        },
            'somesupersecretkey',
            { expiresIn: '1h' });
        res.status(200).json({ token: token, userId: user._id.toString() });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ status: user.status });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.updateUserStatus = async (req, res, next) => {
    const newStatus = req.body.status;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('user not found');
            error.statusCode = 404;
            throw error;
        }

        user.status = newStatus;
        await user.save();

        res.status(200).json({ message: 'User status updated' });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}