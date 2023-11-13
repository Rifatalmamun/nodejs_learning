const Product = require('../../models/product');
const Cart = require('../../models/cart');

const index = (req, res, next) => {
    Cart.fetchAll((cart)=>{
      Product.fetchAll((products)=>{
        const cartProducts = [];
        
        for(product of products){
          const cartProductData = cart.products.find(cp => cp.id === product.id);
          if(cartProductData){
            cartProducts.push({productData: product, quantity: cartProductData.quantity});
          }
        }
     
        res.render('shop/cart/index', {
          pageTitle: 'Shop | Cart',
          path: '/cart',
          products: cartProducts
        });
      });
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