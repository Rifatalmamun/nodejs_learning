const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const loginPage = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

const login = (req, res, next) => {
  User.findById('65573a835aaa966fcbfb026a')
    .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err)=>{
        res.redirect('/products');
      });
    })
    .catch(err => {
      console.log(err); 
    });
}

const logout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  })
}

const signupPage = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

const signup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email: email})
  .then(userExist => {
    if(userExist){
      return res.redirect('/signup');
    }
    return bcrypt.hash(password, 12)
    .then(hashPassword =>{
      console.log(hashPassword);
      const user = new User({
        name: name,
        email: email,
        password: hashPassword,
        cart:{ items: [] }
      });
      return user.save()
    }).then(result => {
        res.redirect('/login');
      });
  }).catch(err => console.log(err));
}

module.exports = {loginPage, login, logout, signupPage, signup}