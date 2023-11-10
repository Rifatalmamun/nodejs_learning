const express = require('express');
const productController = require('../controllers/admin/product');

const router = express.Router();

router.get('/products', productController.index);
router.get('/add-product', productController.create);
router.post('/add-product', productController.store);

module.exports = {router}