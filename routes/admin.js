const express = require('express');
const productController = require('../controllers/admin/product');

const router = express.Router();

router.get('/products', productController.index);
router.get('/add-product', productController.create);
router.post('/store-product', productController.store);
router.get('/edit-product/:productId', productController.edit);
router.post('/update-product', productController.update);
router.post('/delete-product', productController.destroy);

module.exports = {router}