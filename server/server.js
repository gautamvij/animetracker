var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
app.set('views', __dirname + '/../');
app.engine('html', ejs.renderFile);

require('./passport')(passport);

// set up our express application
// log every request to the console
app.use (require('cookie-parser')()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
	}));

// required for passport
app.use(session({
	secret: "myloveishate",
	resave: true,
	saveUninitialized: true
})); 

app.use(express.static(__dirname  + '/../src'));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var models = require('./models/');
var User = models.User;


// injecting passport to the routes
require('./routes')(app, passport);
var Watchlist = models.Watchlist;
models.User.belongsToMany(models.Watchlist, {through: 'UserWatchList'});
models.Watchlist.belongsToMany(models.User, {through: 'UserWatchList'});

// initiating server
models.sequelize.sync({
	force: true,
	logging: console.log
})
	.then(function(){
    models.User.create({username: "gautam", password : "hello"}).then(function(user1){
          models.Watchlist.create({watchlistId : 4, image_url_lge: "This is url", 
          title_english : " title is english", description: "descis not"}).
          then(function(watchList){
          	console.log(user1.setWatchlists);
          	user1.setWatchlists(watchList);
          });
    });

		var server = app.listen(8080, function () {
		    var host = server.address().address;
		    var port = server.address().port;
		    console.log('JustAnime is listening at http://%s:%s', host, port);
  		});
	})
	.catch(function(error){
		console.log(error);
});







/*

//configuring passport
passport.serializeUser(function(user, done) {

        done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        return done(err, user);
    });
});


passport.use('local-login', new LocalStrategy(
    function(username, password, done) {
    console.log(username);
    console.log(password);
    models.User.find({ where: { username: username }}).then(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
      } else if (password != user.password) {
        done(null, false, { message: 'Invalid password'});
      } else {
        console.log("vinsdovnsdovnsdoicndsoivncsdoicns");
        return done(null, user);

      }
    }).error(function(err){
      done(err);
    });
  }
    ));*/
