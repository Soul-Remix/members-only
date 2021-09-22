const User = require('../models/user');
const Post = require('../models/post');

const index = async (req, res, next) => {
  const posts = await User.find();
  res.render('index', { title: 'Home Page', posts, user: req.user });
};

module.exports = { index };
