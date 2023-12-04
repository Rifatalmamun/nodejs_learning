const mongoose = require('mongoose');
const Product = require('../../models/Product');
const ITEMS_PER_PAGE = 3;

const index = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find().countDocuments().then(numProducts => {
    totalItems = numProducts;
    return Product.find()
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE)
  }).then((result)=>{
    res.render('shop/product/index', {
      prods: result?.length > 0 ? result : [],
      pageTitle: 'Shop | products',
      path: '/products',
      totalProducts: totalItems,
      currentPage: page,
      hasNextPage: (ITEMS_PER_PAGE * page) < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page -1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })
  .catch(err => {
    console.log(err)
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