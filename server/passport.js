// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var models = require('./models/');
var User = models.User;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


     passport.deserializeUser(function(id, done) {
        console.log("trying to get the id here");

        User.findById(id).then(function(user) {
            console.log(user.id + "  user found dude");
            done(null,user);
        }).catch(function(error){
            done(error);
        });
    });

    // // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //    User.findById(id, function(err, user) {
    //         done(err, user);
    //     });
    // });

  

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            console.log("trying to get the user here") ;
            User.findOne({ where: {username: username} }).then(function(user) {
                console.log("Trying to get user for " + username);
                console.log("user found is " + user.id + " " + user.username);
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                // if (!bcrypt.compareSync(password, user.password))
                //     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);

            }).catch(function(error){
                if (error)
                    return done(error);
            });

        })
    );
    
    // passport.use(
    //     'local-login',
    //     new LocalStrategy({
    //         // by default, local strategy uses username and password, we will override with email
    //         usernameField : 'username',
    //         passwordField : 'password',
    //         passReqToCallback : true // allows us to pass back the entire request to the callback
    //     },
    //     function(req, username, password, done) { // callback with email and password from our form
    //         User.findOne({ 'local.username' :  username }, function(err, user) {
    //             if (err)
    //                 return done(err);
    //             if (!rows.length) {
    //                 return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
    //             }

    //             // if the user is found but the password is wrong
    //             if (!bcrypt.compareSync(password, rows[0].password))
    //                 return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

    //             // all is well, return successful user
    //             return done(null, rows[0]);
    //         });
    //     })
    // );
};



/*
var LocalStrategy   = require('passport-local').Strategy;
var models = require('./models/');
var User = models.User;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        User.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};

*/