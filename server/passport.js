
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var models = require('./models/');
var User = models.User;

module.exports = function(passport) {

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


    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },

        function(req, username, password, done) {
            
            User.findOne({ where: {username: 'username'} }).then(function(user) {
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    models.User.create({username: username, password : bcrypt.hashSync(password, null, null)})
                    .then(function(user1){
                        console.log(user1);
                        console.log(user1.id + user1.username + user1.password);
                        return done(null,user1);
                    }); 
                }
            }).catch(function(error){
                if (error)
                    return done(error);
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) { 
            console.log("trying to get the user here") ;
            User.findOne({ where: {username: username} }).then(function(user) {
                console.log("Trying to get user for " + username);
                
                if (!user) {
                    console.log("code is here now");
                    return done(null, false, req.flash('loginMessage', 'No user found.')); 
                }

                if (!bcrypt.compareSync(password, user.password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 

                // all is well, return successful user
                return done(null, user);

            }).catch(function(error){
                if (error)
                    return done(error);
            });
        })
    );
};
