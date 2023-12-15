const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async function ({ userInput }, req) {

        // validation
        const errors = [];

        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'email is invalid' });
        }

        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: 'password too short' });
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({ email: userInput.email });

        if (existingUser) {
            const error = new Error('User already exist!');
            throw error;
        }

        const hashedPassword = await bcrypt.hash(userInput.password, 12);

        const user = new User({
            name: userInput.name,
            email: userInput.email,
            password: hashedPassword
        });

        const result = await user.save();
        return { ...result._doc, _id: user._id.toString() };
    },

    login: async function ({ email, password }) {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('user not found');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            const error = new Error('password is incorrect');
            error.code = 401;
            throw error;
        }

        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        }, 'somesupersecretkey', { expiresIn: '1h' });

        return { token: token, userId: user._id.toString() }
    }
}