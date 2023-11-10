// products related logic will be write here...

const Product = require('../models/product');

const getProducts = (req, res, next) => {
  Product.fetchAll((products)=>{
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products?.length > 0,
      activeShop: true,
      productCSS: true
    })
  });
}

const create = (req, res, next) => {
    res.render('add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
}

const store = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

module.exports = {getProducts, create, store};