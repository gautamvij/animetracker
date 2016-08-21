const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
app.use(bodyParser.urlencoded({
 extended: true
}));

const passport = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
app.use(express.static(__dirname  + '/../src'));

app.use (require('cookie-parser')());

app.use(session({
   secret: "myloveishate",
   resave: true,
   saveUninitialized: true
})); 

app.set('views', __dirname + '/../');
app.engine('html', ejs.renderFile);

// loading models for now its only User
var models = require('./models/');

app.use(passport.initialize());
app.use(passport.session());
// getting variable for user model
var User = models.User;




//configuring passport
passport.serializeUser(function(user, done) {

        done(null, user.id);
    });

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    }).then (function(user){
    console.log(user.id + "is the user here ");
    console.log("This step is printed with the id 1 ");
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
        done(null, user);

      }
    }).error(function(err){
      done(err);
    });
  }
    ));

// injecting passport to the routes
require('./routes')(app,passport);

// initiating server
models.sequelize.sync({
	force: true,
	logging: console.log
})
	.then(function(){
    models.User.create({username: "gautam", password : "hello"}).then(function(task){
      task.save();
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





