const index = (req, res, next) => {
    res.render('shop/checkout/index', {
        pageTitle: 'Shop | Checkout',
        path: '/checkout',
        isAuthenticated: req.session.isLoggedIn
      })
}

module.exports = {index}