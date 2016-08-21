
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
app.use(bodyParser.json());
app.use (require('cookie-parser')());

app.use(session({
   secret: "myloveishate",
   resave: true,
   saveUninitialized: true
}));


var models = require('./models/');

app.use(passport.initialize());
//app.use(passport.session());


app.set('views', __dirname + '/../');
app.engine('html', ejs.renderFile);

require('./routes')(app);

passport.serializeUser(function(user, done) {
  console.log("yahan user aa gya " + user.id );
  done(null, user.id);
});




passport.deserializeUser(function(id, done) {
  console.log("here is the deserializeUser stuff " + id );
  models.User.findById(id,function(err, user) {
    console.log("This is the error in done " + err);
    console.log("This si the user in the done " + user.id);
    done(err, user);
  })
  .then (function(user){
    console.log(user.id + "is the user here ");
    console.log("done executed");
  });

});




//done callback returns back to authenticate 
passport.use(new LocalStrategy(
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

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});

/*
app.post('/login', 
	passport.authenticate('local', 
		{ 
			successRedirect: '/abc', 
			failureRedirect: '/' 
		})
	);
*/

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



