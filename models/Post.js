const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  images: [{
    index: Number,
    link: String
  }],
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  caption: String,
  location: String,
  usersWhoLiked: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
}, {timestamps: true})

const Post = mongoose.model('Posts', postSchema)
module.exports = Post