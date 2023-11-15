const path = require('path');
const express = require('express');
const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongo = require('./config/database');

const app = express();
 
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.router);
app.use(shopRoutes.router);
app.use(errorController.get404);

mongo.mongoConnect(()=>{
  app.listen(3005);
  console.log('app listen successfully [port: 3005]');
});