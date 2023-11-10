const index = (req, res, next) => {
    res.render('shop/order/index', {
        pageTitle: 'Shop | Order',
        path: '/order',
      })
}

module.exports = {index}