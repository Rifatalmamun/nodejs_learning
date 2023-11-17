const index = (req, res, next) => {
  req.user.getOrders()
  .then(result =>{
    res.render('shop/order/index', {
      pageTitle: 'Shop | Order',
      path: '/order',
      orders: result
    });
  })
  .catch(err => console.log(err));
}

const store = (req, res, next) => {
  req.user.addOrder()
    .then(result =>{
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
}

module.exports = {index, store}