const loginPage = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split(';')[3].trim().split('=')[1] === 'true';

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

const login = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');

  res.redirect('/');
}

module.exports = {loginPage, login}