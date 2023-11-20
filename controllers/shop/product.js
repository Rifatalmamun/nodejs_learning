const mongoose = require('mongoose');
const Product = require('../../models/Product');

const index = (req, res, next) => {
  Product.find()
  // .select('title price imageUrl -_id')
  // .populate('userId', 'name email -_id')
  .then((response)=>{
    res.render('shop/product/index', {
      prods: response?.length > 0 ? response : [],
      pageTitle: 'Shop | products',
      path: '/products',
      isAuthenticated: req.isLoggedIn
    });
  }).catch((err)=>{
    console.log(err);
  });
}

const show = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
  .then((response)=>{
    res.render('shop/product/show', {
      product: response,
      pageTitle: response?.title || 'Shop | Product Details',
      path: '/shop/product/show',
      isAuthenticated: req.isLoggedIn
    });
  })
  .catch((err)=>{
    console.log(err);
  });
}

module.exports = {index, show};