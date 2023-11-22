const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../../models/User');
const nodemailer = require('nodemailer');
const sendgridTranport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTranport({
  auth:{
    api_key: ''
  }
}));

const signupPage = (req, res, next) => {
  let message = req.flash('error');

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
      req.flash('error', 'Email already used! Please use another email');
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
        return transporter.sendMail({
          to: email,
          from: 'rifat.mamun@bjitgroup.com',
          subject: 'Signup successful',
          html: '<h1>You successfully signed up!</h1>'
        });
      });
  }).catch(err => console.log(err));
}

const loginPage = (req, res, next) => {
  let message = req.flash('error');

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
      req.flash('error', 'Invalid email or password!');
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
        req.flash('error', 'Invalid email or password!');
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

const resetPasswordEmailPage = (req, res, next) => {
  let message = req.flash('error');

  if(message.length > 0){
    message = message[0];
  }else{
    message = null
  }

  res.render('auth/resetPasswordEmail', {
    path: '/reset-password-email',
    pageTitle: 'Reset Password Email',
    errorMessage: message
  });
};

const resetPasswordEmail = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer)=>{
    if(err){
      return res.redirect('/reset-password-email');
    }

    const token = buffer.toString('hex');
    User.findOne({email: email})
      .then(user =>{
        if(!user){
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset-password-email');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save()
        .then(result =>{
          console.log('result: ', result);
          res.redirect(`/reset-password-${token}`);
          
          // return transporter.sendMail({
          //   to: email,
          //   from: 'rifat.mamun@bjitgroup.com',
          //   subject: 'Password reset request',
          //   html:`
          //     <p>You requested a password reset</p>
          //     <p>Click this <a href="http://localhost:3000/reset-password-${token}">link</a> to set a new password.</p>
          //   `
          // });
        });
      })
      .catch(err =>{
        console.log(err);
      })
  });
}

const resetPasswordPage = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: {$gt: Date.now()}
    })
    .then(user =>{
      if(!user){
        return res.redirect('/login');
      }

      let message = req.flash('error');

      if(message.length > 0){
        message = message[0];
      }else{
        message = null
      }

      return res.render('auth/resetPassword', {
        path: '/reset-password',
        pageTitle: 'Reset Password Form',
        errorMessage: message,
        userId: user._id.toString(),
        token: token
      });
    })
    .catch(err => console.log(err));
}

const resetPassword = (req, res, next) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const token = req.body.token;

  if(password === confirmPassword){
    let resetUser;

    User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiration: {$gt: Date.now()},
      })
      .then(user =>{
        resetUser = user;
        if(!user){
          return res.redirect('/login');
        }

        return bcrypt.hash(password, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = null;
        resetUser.resetTokenExpiration = undefined;
        
        return resetUser.save();
      })
      .then(result => {
          res.redirect('/login');
      })
      .catch(err => console.log(err));

  }else{
    req.flash('error', 'Confirm password not match');
  }
}

module.exports = {loginPage, login, logout, signupPage, signup, resetPasswordEmailPage, resetPasswordEmail, resetPasswordPage, resetPassword}