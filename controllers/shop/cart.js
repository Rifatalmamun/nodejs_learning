const Product = require('../../models/Product');
const Cart = require('../../models/Cart');

const index = (req, res, next) => {
  res.render('shop/cart/index', {
    pageTitle: 'Shop | Cart',
    path: '/cart',
    products: []
  });
}

const store = (req, res, next) => {
  res.redirect('/cart');
}

const destroy = (req, res, next) => {
  
}

module.exports = {index, store, destroy}