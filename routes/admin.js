const express = require('express');
const productController = require('../controllers/admin/product');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/products',isAuth, productController.index);
router.get('/add-product',isAuth, productController.create);
router.post('/store-product',isAuth, productController.store);
router.get('/edit-product/:productId',isAuth, productController.edit);
router.post('/update-product',isAuth, productController.update);
router.post('/delete-product',isAuth, productController.destroy);

module.exports = {router}