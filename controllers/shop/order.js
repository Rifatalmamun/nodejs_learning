const Order = require('../../models/Order');
const User = require('../../models/User');

const index = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
  .then(result =>{
    res.render('shop/order/index', {
      pageTitle: 'Shop | Order',
      path: '/order',
      orders: result,
      isAuthenticated: req.isLoggedIn
    });
  })
  .catch(err => console.log(err));
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
        name: req.user.name,
        userId: req.user // ref User
      }
    });

    order.save().then(()=>{
      // now remove the user cart
      User.findById(req.user._id).then((user)=>{
        user.cart.items = [];
        return user.save();
      })

      res.redirect('/orders')
    }).catch(err => console.log(err));
  })
  .catch(err => console.log(err));
}

module.exports = {index, store}