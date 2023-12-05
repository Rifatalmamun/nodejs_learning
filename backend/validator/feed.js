const { body } = require('express-validator');

const postFeed = [
    body('title', 'please input valid title')
        .trim()
        .isLength({min: 5}).withMessage('title min length is 5'),

    body('content', 'please input valid content')
        .trim()
        .isLength({min: 10}).withMessage('content min length is 10')

];

module.exports = { postFeed }