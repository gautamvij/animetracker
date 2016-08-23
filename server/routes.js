const request = require('request');
const config = require('./config.json');

module.exports = function (app,passport){
	'use strict';

	app.get('/', function (req, res) {
		res.locals.login = req.isAuthenticated();
	    res.render('index.html');
  	});

	app.get('/apis', function(req,res){
		var search = req.query.Query;
		request({ url : config.search_url + search , qs : {'access_token' : config.access_token}}, 
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


	app.get('/apib', function(req,res){
		var options = req.query.options;
		console.log(typeof options);
		console.log(options);
		var newoptions = JSON.parse(options);
		console.log(newoptions);
		options = merge_options(newoptions, {'access_token' : config.access_token});
		console.log(options);
		request({ url : config.browse_url , qs : options}, 
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

	app.get('/loggedin', function(req, res) { 
		console.log(req.isAuthenticated());
		res.send(req.isAuthenticated() ? req.user : '0'); 
	});

	app.get('/login', function(req, res) {
		res.render('login.html');
	});

	app.get('/signup', function(req, res) {
		res.render('signup.html');
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

};

function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname1 in obj2) { obj3[attrname1] = obj2[attrname1]; }
    return obj3;
}

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}