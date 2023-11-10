const index = (req, res, next) => {
    res.render('shop/cart/index', {
        pageTitle: 'Shop | Cart',
        path: '/cart',
      })
}

const store = (req, res, next) => {
  const productId = req.body.productId;
  console.log('cart product id: ', productId);
  res.redirect('/cart');
}

module.exports = {index, store}