var express = require('express');
var router = express.Router();
var request = require('request');
var auth = require('./auth');

/* GET users listing. */
router.get(
    '/', 
    auth.isLoggedIn, 
    function (req, res, next) {
        // options for GET request
        let options = {
            url: req.session.authInfo.userId,
            headers: {
                'Authorization': `Bearer ${req.session.authInfo.accessToken}`
            }
        };

        function getCallback (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log('the data is: ' + JSON.stringify(data));
            res.render('user_data', {userData: JSON.parse(data.body)});
            // res.json(data);
        }

        request(options, getCallback);
});

module.exports = router;
