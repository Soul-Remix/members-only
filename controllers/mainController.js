const User = require('../models/user');
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');
const { genPassword } = require('../config/passwordUtils');

const avatarArr = [
  'images/alien.svg',
  'images/clown.svg',
  'images/cowboy.svg',
  'images/devil.svg',
  'images/evil.svg',
  'images/ghost.svg',
  'images/robot.svg',
  'images/spy.svg',
];

const index = async (req, res, next) => {
  const posts = await Post.find();
  res.render('index', {
    title: 'Home Page',
    user: req.user,
    post,
  });
};

const signup_get = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('sign-up', { title: 'Sign Up', errors: [], user: {} });
};

const signup_post = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please enter a valid Username')
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the username'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Min password length is 6 character')
    .isLength({ max: 20 })
    .withMessage('Max password length is 20 character'),
  body('password2', "passwords don't match").custom((value, { req }) => {
    return value === req.body.password;
  }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      console.log(errors.array());
      const { hash, salt } = genPassword(req.body.password);
      const email = req.body.email.toLowerCase();
      const [foundUserEmail, foundUserName] = await Promise.all([
        User.find({ email: email }),
        User.find({ username: req.body.username }),
      ]);
      const user = new User({
        username: req.body.username,
        email,
        isAdmin: false,
        hash,
        salt,
        avatar: avatarArr[Math.floor(Math.random() * avatarArr.length)],
      });
      if (!errors.isEmpty()) {
        res.render('sign-up', {
          title: 'Sign Up',
          errors: errors.array(),
          user,
        });
      } else if (foundUserEmail.length > 0) {
        res.render('sign-up', {
          title: 'Sign Up',
          errors: [{ msg: 'Email is already in use' }],
          user,
        });
      } else if (foundUserName.length > 0) {
        res.render('sign-up', {
          title: 'Sign Up',
          errors: [{ msg: 'Username is already in use' }],
          user,
        });
      } else {
        await user.save();
        res.redirect('/login');
      }
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = { index, signup_get, signup_post };
