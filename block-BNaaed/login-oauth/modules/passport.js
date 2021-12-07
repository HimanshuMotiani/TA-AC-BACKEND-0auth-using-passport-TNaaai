var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var User = require('../models/User');

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      var profileData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.email,
      };
    console.log(profile);
      User.findOne({ email: profile._json.email }, (error, user) => {
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

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
        done(error, user)
    })
})