var request = require('request');
var config = require('./config.json');
var models = require('./models/');


module.exports = function (app,passport){

  app.get('/', function (req, res) {
		res.locals.login = req.isAuthenticated(); 
		res.render('index.html');
	});

	app.get('/apianime', function(req,res){

		var ID = req.query.id;
		request({ url : config.anime_url + ID , qs : {'access_token' : config.access_token}}, 
			function (error, response, body) {
		if (!error && response.statusCode === 200) {
			// console.log(body.length + ' objects returned');
			res.send(body);
		}
		else
		{
		res.send(error);
		}	
		});
		});

		app.get('/adddata', isLoggedIn, function(req,res){
		// console.log(req.user.id);
		var animeId = req.query.animeId;
		var storeType = req.query.storeType;
		models.Watchlist.create({storeType : storeType,animeId:animeId, userId: req.user.id})
		.then(function(store){
			// console.log(store);
			// need to send some feedback on sending rows it shows express deprected error for status code 
			res.send('1');
		}).catch(function(error){
			res.send(error);
		});

	});

	app.get('/removedata', isLoggedIn, function(req,res){
		console.log(req.user.id);
		var animeId = req.query.animeId;
		models.Watchlist.destroy({
			where: {
				userId : req.user.id,
				animeId: animeId
			}
		}).then(function(rows){
			res.send('1');
		}).catch(function(error){
			res.send(error);
		});

	});

	app.get('/getdata', isLoggedIn, function(req,res){
		var userId = req.user.id;
		models.Watchlist.findAll({
  		where : {
  			userId : userId
  		}
	  	}).then(function(rows){
	  		res.send(rows);
	  	}).catch(function(error){
			res.send(error);
		});
	});

	app.get('/apisearch', function(req,res){
		var search = req.query.Query;
		request({ url : config.search_url + search , qs : {'access_token' : config.access_token}}, 
			function (error, response, body) {
		  	if (!error && response.statusCode === 200) {
		  		// console.log(body.length + " objects returned");
		    	res.send(body);
		      }
		      else
		      {
		      	res.send(error);
		      }
			});
	});

	app.get('/apigenre', function(req,res){
		request({ url : config.genre_url , qs : {'access_token' : config.access_token}}, 
		function (error, response, body) {
		if (!error && response.statusCode === 200) {
			// console.log(body.length + " objects returned");
	 	res.send(body);
	    }
      else
	     {
	      	res.send(error);
	      }
		});
	});

	app.get('/apibrowse', function(req,res){
		var options = req.query.options;
		// console.log(typeof options);
		// console.log(options);
		var newoptions = JSON.parse(options);
		// console.log(newoptions);
		options = merge_options(newoptions, {'access_token' : config.access_token});
		// console.log(options);
		request({ url : config.browse_url , qs : options}, 
			function (error, response, body) {
		if (!error && response.statusCode === 200) {
// console.log(body.length + " objects returned");
		res.send(body);
		}
		else
		{
		res.send(error);
    }
			});
	});

	app.get('/loggedin', function(req, res) { 
		// console.log(req.isAuthenticated());
		res.send(req.isAuthenticated() ? req.user : '0'); 
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/#/', // redirect to the secure profile section
		failureRedirect : '/#/register/0', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/#/', // redirect to the secure profile section
  failureRedirect : '/#/register/1/', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
		}),
    function(req, res) {
        // console.log("hello");
        // console.log(req.body.username);
        // console.log(req.body.password);

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/');
    });

};

function merge_options(obj1,obj2){
  var objectWithMergedOptions = {};
  for (var attrname in obj1) { objectWithMergedOptions[attrname] = obj1[attrname]; }
  for (var attrname1 in obj2) { objectWithMergedOptions[attrname1] = obj2[attrname1]; }
  return objectWithMergedOptions;
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.send('No');
}
