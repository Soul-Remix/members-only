const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true, maxlength: 150 },
  body: { type: String, required: true },
  Author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

userSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

module.exports = mongoose.model('Post', postSchema);
