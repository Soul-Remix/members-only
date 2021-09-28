const User = require('../models/user');
const Post = require('../models/post');
const { body, validationResult } = require('express-validator');
const { genPassword } = require('../config/passwordUtils');
const passport = require('passport');

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
  const posts = await Post.find().populate('user').sort({ date: -1 });
  res.render('index', {
    title: 'Home Page',
    user: req.user,
    posts,
  });
};

// Sign Up

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

// Login

const login_get = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('login', { title: 'Login', msg: undefined });
};

const login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login-error',
});

// Login Error

const loginError = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('login-error', { title: 'Credintial Error' });
};

// Logout

const logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};

// Create Post

const createPost_get = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('create-post', {
      title: 'Create Post',
      user: req.user,
      post: {},
      errors: [],
    });
  }
};

const createPost_post = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please enter a valid post title'),
  body('body')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please enter a valid post body'),
  async (req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      user: req.user.id,
      date: Date.now(),
    });
    if (!errors.isEmpty()) {
      res.render('create-post', {
        title: 'Create Post',
        user: req.user,
        post,
        errors: errors.array(),
      });
    } else {
      await post.save();
      res.redirect('/');
    }
  },
];

// Delete Post

const deletePost = async (req, res, next) => {
  const id = req.params.id;
  const postExist = await Post.findById(id);
  if (!req.isAuthenticated() && !req.user.isAdmin) {
    res.redirect('/error');
  }
  if (!postExist) {
    res.redirect('/');
  }
  await Post.findByIdAndDelete(id);
  res.redirect('/');
};

// User Profile

const userProfile = async (req, res, next) => {
  let notAuthorized = false;
  if (!req.isAuthenticated()) {
    res.redirect('/error');
  } else {
    const posts = await Post.find({ user: req.user.id })
      .populate('user')
      .sort({ date: -1 });
    res.render('user-profile', {
      title: req.user.username,
      posts,
      notAuthorized,
      user: req.user,
    });
  }
};

const error = (req, res, next) => {
  res.render('profile-error', { title: 'Error' });
};

module.exports = {
  index,
  signup_get,
  signup_post,
  login_get,
  login_post,
  loginError,
  logout,
  createPost_get,
  createPost_post,
  userProfile,
  error,
  deletePost,
};
