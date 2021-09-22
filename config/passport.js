const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const { validPassword } = require('./passwordUtils');

const strategy = new localStrategy(async function (username, password, done) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false);
    }
    const isValid = validPassword(password, user.hash, user.salt);
    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
});

passport.use(strategy);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});
