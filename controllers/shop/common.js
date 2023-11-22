const welcome = (req, res, next) => {
    res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/'

      })
}

module.exports = {welcome}