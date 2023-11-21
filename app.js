const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://rifat:Rifat150107@cluster0.yi05v88.mongodb.net/shop';

const app = express();
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

app.use((req, res, next)=>{
  if(!req.session.user){
    return next();
  }
  
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.router);
app.use(shopRoutes.router);
app.use(authRoutes.router);
app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
  .then(res =>{
    app.listen(3005); 
  }).catch(err =>{
    console.log('connection failed!');
  });