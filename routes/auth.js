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
  }, function (err, data) {
    // handle errors if present
    if (err) {
      return next(err);
    }

    // set session data in redis
    req.session.loginCounter++;
    req.session.authInfo = {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      userId: data.body.id,
      signature: data.body.signature,
      instanceUrl: data.body.instance_url,
      issuedAt: data.body.issued_at,
      userIsAuthenticated: true
    }
    req.session.save();
    console.log('session data saved as: ' + JSON.stringify(req.session.authInfo));
    // send user back to homepage to view stats
    res.redirect('/');
  });
};

// logout function that revokes the oAuth token from Salesforce
function logout (req, res, next) {
  // first define the URL for the token revoke service
  let revokeUrl = 'https://login.salesforce.com/services/oauth2/revoke';

  // POST request with data
  request.post(revokeUrl, {
    form: {
      token: req.session.authInfo.accessToken
    }
  }, function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log('everything is invalidated: ' + JSON.stringify(data));
    // destroy the session and redirect to root
    req.session.destroy();
    res.redirect('/');
  });
}

// Export the functions to be used in the router.
module.exports = {
  login: login,
  callback: callback,
  logout: logout
}
