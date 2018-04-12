var express = require('express');
var router = express.Router();

// user defined stuff goes here.
var auth = require('./auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  // set a redis page counter
  req.session.pageCounter++;
  console.log('hit the root route');
  res.render('index', {
    title: 'oAuth Demo',
    pageCount: (req.session.pageCounter ? req.session.pageCounter : 'not set'),
    userId: (req.session.authInfo ? req.session.authInfo.userId : 'not set'),
    access_token: (req.session.authInfo ? req.session.authInfo.accessToken : 'not set'),
    loginCount: req.session.loginCounter,
    sessionId: req.session.id
  });
});

// adding the routes for the auth transactions
router.get('/login', auth.login);
router.get('/salesforce/auth', auth.callback);

// logout route
router.get('/logout', auth.logout);

module.exports = router;
