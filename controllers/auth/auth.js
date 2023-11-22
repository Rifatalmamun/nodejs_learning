const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const signupPage = (req, res, next) => {
  let message = req.flash('signupFailedMsg');

  if(message.length > 0){
    message = message[0];
  }else{
    message = null
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
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
      req.flash('signupFailedMsg', 'Email already used! Please use another email');
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

const loginPage = (req, res, next) => {
  let message = req.flash('loginFailedMsg');

  if(message.length > 0){
    message = message[0];
  }else{
    message = null
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
  .then(user => {
    if(!user){
      req.flash('loginFailedMsg', 'Invalid email or password!');
      return res.redirect('/login');
    }
    return bcrypt.compare(password,user.password)
      .then(isMatch =>{
        if(isMatch){
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err)=>{
            res.redirect('/products');
          });
        }
        req.flash('loginFailedMsg', 'Invalid email or password!');
        return res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
        res.redirect('/login')
      });
  })
  .catch(err => {
    console.log(err);
    res.redirect('/login')
  });
}

const logout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  })
}

module.exports = {loginPage, login, logout, signupPage, signup}