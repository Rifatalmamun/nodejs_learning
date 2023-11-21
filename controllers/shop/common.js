const welcome = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn

      })
}

module.exports = {welcome}