var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var port     = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');

require('./passport')(passport);
app.use(express.static(__dirname  + '/../src'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.set('views', path.join(__dirname, '../views'));
app.engine('html', ejs.renderFile);
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 



require('./routes')(app,passport);

var models = require('./models/');

models.sequelize.sync({
	force: false,
	logging: console.log
}).then(function() {
	'use strict';
	var server = app.listen(8080, function () {
	    var host = server.address().address;
	    var port = server.address().port;
	    console.log('AnimeTracker is listening at http://%s:%s', host, port);
	  });
});
// 	models.User.create({username: "pranjal", password : "hello"}).then(function(user1){
//           //console.log(user1);
//           console.log(user1.id + user1.username + user1.password);
//           // models.addWatchlist
//           //models.Watchlist.create({storeType : 0,animeId:3, userId: 1});
//           models.Watchlist.create({storeType : 0,animeId:2, userId: 1}).
//           then(function(watchList){
//           	//console.log(watchList);
//           	models.Watchlist.findAll({
//           		where : {
//           			userId : 1
//           		}
//           	}).then(function(data){
//           		//console.log(data);
//           		console.log(data[0].animeId + "this is the storeType");
//           		//console.log(data[1].animeId + "this is the storeType");
//           		models.Watchlist.destroy({
//           		where: {
//           			userId :1,
//           			animeId : 2
//           		}});
//           	});
//           	});
//           	models.Watchlist.destroy({
//           		where: {
//           			userId :1,
//           			animeId : 2
//           		}
//           	});
//           });
          
      


// var server = app.listen(8080, function () {
// 	'use strict';
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('AnimeTracker is listening at http://%s:%s', host, port);
//   });



