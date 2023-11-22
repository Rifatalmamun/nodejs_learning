const index = (req, res, next) => {
    res.render('shop/checkout/index', {
        pageTitle: 'Shop | Checkout',
        path: '/checkout'
      })
}

module.exports = {index}