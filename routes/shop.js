const express = require('express');
const commonController = require('../controllers/shop/common');
const productController = require('../controllers/shop/product');
const cartController = require('../controllers/shop/cart');
const orderController = require('../controllers/shop/order');
// const checkoutController = require('../controllers/shop/checkout');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', commonController.welcome);

router.get('/products', productController.index);
router.get('/product/:productId', productController.show);

router.get('/cart',isAuth, cartController.index);
router.post('/store-cart',isAuth, cartController.store);
router.post('/delete-cart',isAuth, cartController.destroy);

router.get('/orders',isAuth, orderController.index);
router.post('/store-order',isAuth, orderController.store);

// router.get('/checkout', checkoutController.index);

module.exports = {router};
