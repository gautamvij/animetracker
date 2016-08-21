const request = require('request');
const config = require('./config.json');

function isLoggedIn(req, res, next) {

	console.log("code is hecsdcsdcscre");
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
    {
    	console.log("well we came here ");
        return next();
    }

    console.log("na we got redirected");
    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = function (app,passport){
	'use strict';

	app.get('/', function (req, res) {
	    res.render('index.html');
  	});

	app.get('/api', function(req,res){
	var search = req.query.Query;
	request(config.search_url + search +'?access_token=' + config.access_token, 
		function (error, response, body) {
		  	if (!error && response.statusCode == 200) {
		  		console.log(body.length + " objects returned");
		    	res.send(body);
		      }
		      else
		      {
		      	res.send(error);
		      }
		});
	});


	// page never comes here 
	app.get('/profile', isLoggedIn, function(req, res) {
        res.render('fun.html');
    });


	app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	
};