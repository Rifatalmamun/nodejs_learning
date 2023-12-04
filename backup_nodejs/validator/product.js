const {body} = require('express-validator');

const store = [
    body('title','invalid title')
    .notEmpty()
    .isString()
    .isLength({min: 3}).withMessage('title length issue')
    .trim(),

    body('price','invalid price')
    .notEmpty()
    .isNumeric(),

    body('description','invalid description')
    .notEmpty()
    .isLength({min: 3, max: 250})
    .trim()
]

const update = [
    body('title','invalid title')
    .notEmpty()
    .isString()
    .isLength({min: 3}).withMessage('title length issue')
    .trim(),

    body('price','invalid price')
    .notEmpty()
    .isNumeric(),

    body('description', 'invalid description')
    .notEmpty()
    .isLength({min: 3, max: 250})
    .trim()
]

module.exports = {store, update}