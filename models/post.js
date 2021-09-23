const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

postSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

module.exports = mongoose.model('Post', postSchema);
