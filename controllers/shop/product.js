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
      path: '/products'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

const show = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
  .then((response)=>{
    res.render('shop/product/show', {
      product: response,
      pageTitle: response?.title || 'Shop | Product Details',
      path: '/shop/product/show'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

module.exports = {index, show};