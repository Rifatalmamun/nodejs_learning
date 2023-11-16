const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongo = require('./config/database');
const User = require('./models/User');

const app = express();
 
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// logged in user
app.use((req, res, next) => {
  User.findById('65559f886c593ecc27386b8e')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => {
      console.log(err);
    }); 
});

app.use('/admin', adminRoutes.router);
app.use(shopRoutes.router);
app.use(errorController.get404);

mongo.mongoConnect(()=>{

  app.listen(3005);
  console.log('app listen successfully [port: 3005]');
});