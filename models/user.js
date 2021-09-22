const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  avatar: { type: String, required: true },
  email: { type: String, required: true },
});

userSchema.virtual('url').get(function () {
  return '/user/' + this._id;
});

module.exports = mongoose.model('User', userSchema);
