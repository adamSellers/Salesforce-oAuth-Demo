// Copyright 2018, Adam Sellers - Sales Engineering, Salesforce.com Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// - Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
// - Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
// - Neither the name of the salesforce.com nor the names of its contributors
//   may be used to endorse or promote products derived from this software
//   without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var request = require("request");

var clientId = process.env.CLIENTID;
var clientSecret = process.env.CLIENTSECRET;
var callbackUrl = process.env.CALLBACKURL;

var salesforceEndpoint = process.env.SALESFORCE_ENDPOINT;

function login(req, res, next) {
    // we simply just redirect the user to the Salesforce login service.
    res.redirect(
        `${salesforceEndpoint}/services/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${callbackUrl}&display=popup`
    );
}

function callback(req, res, next) {
    // first we harvest the code variable
    let authCode = req.query.code;
    console.log("auth code is: " + authCode);

    // the URL that we are going to post the auth code to
    let tokenUrl = `${salesforceEndpoint}/services/oauth2/token`;
    // post to token url to get access token using the request library
    request.post(
        tokenUrl,
        {
            form: {
                code: authCode,
                grant_type: "authorization_code",
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: callbackUrl,
            },
            json: true,
        },
        function (err, data) {
            // handle errors if present
            console.log("data is: " + JSON.stringify(data));
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
                userIsAuthenticated: true,
            };
            req.session.save();
            console.log(
                "session data saved as: " + JSON.stringify(req.session.authInfo)
            );
            // send user back to homepage to view stats
            res.redirect("/");
        }
    );
}

// logout function that revokes the oAuth token from Salesforce
function logout(req, res, next) {
    // first define the URL for the token revoke service
    let revokeUrl = `${salesforceEndpoint}/services/oauth2/revoke`;

    // POST request with data
    request.post(
        revokeUrl,
        {
            form: {
                token: req.session.authInfo.accessToken,
            },
        },
        function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log("everything is invalidated: " + JSON.stringify(data));
            // destroy the session and redirect to root
            req.session.destroy();
            res.redirect("/");
        }
    );
}

// function to check if logged in
function isLoggedIn(err, req, res, next) {
    if (err) {
        return next(err);
    }
    if (!req.session.authInfo.userIsAuthenticated) {
        console.log("user must login first!");
        res.redirect("/");
    } else {
        next();
    }
}

// Export the functions to be used in the router.
module.exports = {
    login: login,
    callback: callback,
    logout: logout,
    isLoggedIn: isLoggedIn,
};
