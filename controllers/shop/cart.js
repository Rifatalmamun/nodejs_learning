const Product = require('../../models/Product');
const Cart = require('../../models/cart');

const index = (req, res, next) => {
  res.render('shop/cart/index', {
    pageTitle: 'Shop | Cart',
    path: '/cart',
    products: []
  });
}

const store = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId, (product)=>{
    if(product){
      Cart.addToCart(productId, product.price);
    }
    
  })

  res.redirect('/cart');
}

const destroy = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId, (product)=>{
    Cart.deleteCartProduct(productId, product.price);
    res.redirect('/cart');
  })
}

module.exports = {index, store, destroy}