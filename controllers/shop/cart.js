const Product = require("../../models/Product");


const index = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render('shop/cart/index', {
        pageTitle: 'Shop | Cart',
        path: '/cart',
        products: products ?? []
      });
    }).catch(err =>{
      console.log(err);
    });
}

const store = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
  .then(product =>{
     return req.user.addToCart(product);
    }).then(response =>{
      res.redirect('/cart');
    }).catch(err =>{
      console.log(err);
    });
}

const destroy = (req, res, next) => {
  const productId = req.body.productId;

  req.user.deleteCartProduct(productId)
  .then(response =>{
    res.redirect('/cart');
  }).catch(err =>{
    console.log(err);
  });
}

module.exports = {index, store, destroy}