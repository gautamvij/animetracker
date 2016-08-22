// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8080;
const ejs = require('ejs');
var passport = require('passport');
var flash    = require('connect-flash');

// configuration ===============================================================
// connect to our database

require('./passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.set('views', __dirname + '/../');
//app.set('view engine', 'ejs');app.set('views', __dirname + '/../');
app.engine('html', ejs.renderFile);
//app.engine('html', ejs.renderFile); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(__dirname  + '/../src'));

// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);


var models = require('./models/');
var User = models.User;
//+++++++++++++++++++++++
  
//+++++++++++++++++++++++
models.User.belongsToMany(models.Watchlist, {through: 'UserWatchList'});
models.Watchlist.belongsToMany(models.User, {through: 'UserWatchList'});

// initiating server
models.sequelize.sync({
	force: true,
	logging: console.log
})
	.then(function(){
    models.User.create({username: "gautam", password : "hello"}).then(function(user1){
          //console.log(user1);
          console.log(user1.id + user1.username + user1.password);
          models.Watchlist.create({watchlistId : 4, image_url_lge: "This is url", 
          title_english : " title is english", description: "descis not"}).
          then(function(watchList){
          	console.log(user1.setWatchlists);
          	user1.setWatchlists(watchList);
          });
    });

		var server = app.listen(8081, function () {
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
