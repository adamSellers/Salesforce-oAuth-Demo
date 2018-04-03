// const express = require('express');
var request = require('request');

var clientId = process.env.CLIENTID;
var clientSecret = process.env.CLIENTSECRET;
var callbackUrl = process.env.CALLBACKURL;

function login (req, res, next) {
  // we simply just redirect the user to the Salesforce login service.
  res.redirect(`https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&display=popup`);
};

function callback (req, res, next) {
  // first we harvest the code variable
  let authCode = req.query.code;

  // the URL that we are going to post the auth code to
  let tokenUrl = 'https://login.salesforce.com/services/oauth2/token';
  // post to token url to get access token using the request library
  request.post(tokenUrl, {
    form: {
      code: authCode,
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl
    },
    json: true
  }, function (err, res, body) {
    // handle errors if present
    if (err) {
      return next(err);
    }
    // work with the response data
    console.log('response is: ' + JSON.stringify(res));
  });

  res.redirect('/'); // implement something else here!
}

// Export the functions to be used in the router.
module.exports = {
  login: login,
  callback: callback
}
