var passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    var profileData = {
        name: profile.displayName,
        username: profile.displayName,
        email: profile._json.email,
      };
     User.findOne({ name: profile.displayName }, (error, user) => {
        if (error) return done(error);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (error) return done(error);
            return done(null, addedUser);
          });
        }
        else{
            done(null, user);
        }
      });
    }
  )
);
passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        var profileData = {
          name: profile.displayName,
          username: profile.username,
          email: profile._json.email,
        };
        User.findOne({ name: profile.displayName  }, (error, user) => {
          if (error) return done(error);
          if (!user) {
            User.create(profileData, (err, addedUser) => {
              if (error) return done(error);
              return done(null, addedUser);
            });
          }
          else{
              done(null, user);
          }
        });
      }
    )
  );

  passport.use(new LocalStrategy(
    function(name, password, done) {
        console.log(name,password);
      User.findOne({ name: name }, function(err, user) {
          
          console.log(err,user);
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        return done(null, user);
      });
    }
  ));

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user)
    })
})