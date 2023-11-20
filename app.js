const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/User');

const app = express();
 
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// logged in user
app.use((req, res, next) => {
  User.findById('65573a835aaa966fcbfb026a')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err); 
    });
});

app.use('/admin', adminRoutes.router);
app.use(shopRoutes.router);
app.use(authRoutes.router);
app.use(errorController.get404);

mongoose.connect('mongodb+srv://rifat:Rifat150107@cluster0.yi05v88.mongodb.net/shop')
  .then(res =>{
    app.listen(3005); 
  }).catch(err =>{
    console.log('connection failed!');
  });