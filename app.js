const path = require('path');
const express = require('express');
const sequelize = require('./config/database');
const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.router);
app.use(shopRoutes.router);
app.use(errorController.get404);

// login feature not available now, so by default we fetch a user (id=1)

app.use((req, res, next) => {
    User.findByPk(1)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
});

// model relationship
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);


sequelize
.sync()
.then(result => {
  return User.findByPk(1);
})
.then(user => {
  if (!user) {
    return User.create({ name: 'Rifat', email: 'rifat@gmail.com' });
  }
  return user;
})
.then(user => {
  // console.log(user);
  app.listen(3005);
})
.catch(err => {
  console.log(err);
});