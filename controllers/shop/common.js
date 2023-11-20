const welcome = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.isLoggedIn

      })
}

module.exports = {welcome}