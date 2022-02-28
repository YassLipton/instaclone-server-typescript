const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  text: String,
  usersWhoLiked: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  post: { type: Schema.Types.ObjectId, ref: 'Posts' },
}, {timestamps: true})

const Comment = mongoose.model('Comments', commentSchema)
module.exports = Comment