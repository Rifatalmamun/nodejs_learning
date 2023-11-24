const Order = require('../../models/Order');
const User = require('../../models/User');

const index = (req, res, next) => {
  Order.find({'user.userId': req.session.user._id})
  .then(result =>{
    res.render('shop/order/index', {
      pageTitle: 'Shop | Order',
      path: '/order',
      orders: result
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

const store = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(result => {
   
    const products = result.cart.items.map((d)=>{
      return {product: {...d.productId}, quantity: d.quantity}
    });

    const order = new Order({
      products: products,
      user:{
        name: req.session.user.name,
        userId: req.session.user // ref User
      }
    });

    order.save().then(()=>{
      // now remove the user cart
      User.findById(req.session.user._id).then((user)=>{
        user.cart.items = [];
        return user.save();
      })

      res.redirect('/orders')
    }).catch(err => console.log(err));
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

module.exports = {index, store}