const express = require('express');
const commonController = require('../controllers/shop/common');
const productController = require('../controllers/shop/product');
// const cartController = require('../controllers/shop/cart');
// const checkoutController = require('../controllers/shop/checkout');
// const orderController = require('../controllers/shop/order');

const router = express.Router();

router.get('/', commonController.welcome);

router.get('/products', productController.index);
router.get('/product/:productId', productController.show);

// router.get('/cart', cartController.index);
// router.post('/store-cart', cartController.store);
// router.post('/delete-cart', cartController.destroy);

// router.get('/orders', orderController.index);
// router.post('/store-order', orderController.store);

// router.get('/checkout', checkoutController.index);

module.exports = {router};
