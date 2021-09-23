const User = require('../models/user');
const Post = require('../models/post');

const index = async (req, res, next) => {
  res.render('index', {
    title: 'Home Page',
    user: undefined,
  });
};

module.exports = { index };
