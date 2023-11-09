const express = require('express');
const productController = require('../controllers/product');

const router = express.Router();

router.get('/add-product', productController.create);
router.post('/add-product', productController.store);

module.exports = {router}