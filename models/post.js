const mongoose = require('mongoose');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

postSchema.virtual('dateNow').get(function () {
  return dayjs(this.date).fromNow();
});

module.exports = mongoose.model('Post', postSchema);
