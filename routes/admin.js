const express = require('express');
const productController = require('../controllers/admin/product');
const isAuth = require('../middleware/isAuth');
const {body} = require('express-validator');

const router = express.Router();

router.get('/products',isAuth, productController.index);
router.get('/add-product',isAuth, productController.create);
router.post('/store-product',
    [
        body('title','invalid title')
        .notEmpty()
        .isString()
        .isLength({min: 3}).withMessage('title length issue')
        .trim(),

        body('imageUrl','invalid image url')
        .notEmpty()
        .isURL(),

        body('price','invalid price')
        .notEmpty()
        .isNumeric(),

        body('description','invalid description')
        .notEmpty()
        .isLength({min: 3, max: 250})
        .trim()
    ],
    isAuth, productController.store);
router.get('/edit-product/:productId',isAuth, productController.edit);
router.post('/update-product',
    [
        body('title','invalid title')
        .notEmpty()
        .isString()
        .isLength({min: 3}).withMessage('title length issue')
        .trim(),

        body('imageUrl')
        .notEmpty()
        .isURL(),

        body('price','invalid price')
        .notEmpty()
        .isNumeric(),

        body('description')
        .notEmpty()
        .isLength({min: 3, max: 250})
        .trim()
    ],
    isAuth, productController.update);
router.post('/delete-product',isAuth, productController.destroy);

module.exports = {router}