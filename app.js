const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://rifat:Rifat150107@cluster0.yi05v88.mongodb.net/shop';

const app = express();
const csrfProtection = csrf();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions' 
});
 
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next)=>{
  // res.locals value render in every view template
  res.locals.isAuthenticated= req.session.isLoggedIn;
  res.locals.csrfToken= req.csrfToken();
  next();
});

app.use((req, res, next)=>{
  if(!req.session.user){
    return next();
  }
  
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
});

app.get('/500',errorController.get500);

app.use('/admin', adminRoutes.router);
app.use(shopRoutes.router);
app.use(authRoutes.router);
app.use(errorController.get404);

app.use((error, req, res, next)=>{
  res.redirect('/500');
});

mongoose.connect(MONGODB_URI)
  .then(res =>{
    app.listen(3005); 
  }).catch(err =>{
    console.log('connection failed!');
  });