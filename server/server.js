const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const ejs = require('ejs');
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
app.set('views', __dirname + '/../views/');
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
	force: true,
	logging: console.log
});

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('AnimeTracker is listening at http://%s:%s', host, port);
  });


