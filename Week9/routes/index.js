var express = require('express');
var router = express.Router();
const validateToken = require('../auth/validateToken')

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'home' })
});

router.get('/register.html', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login.html', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

module.exports = router;
