var express = require('express');
var router = express.Router();

// user defined stuff goes here.
var auth = require('./auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// adding the routes for the auth transactions
router.get('/login', auth.login);
router.get('/callback', auth.callback);

module.exports = router;
