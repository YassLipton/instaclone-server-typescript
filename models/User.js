const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  password: String,
  fullName: String,
  email: String,
  phone: String,
  bio: String,
  link: String,
  isPrivate: Boolean,
  isVerified: Boolean,
  profilePicUrl: String,
  followers: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
}, {timestamps: true})

const User = mongoose.model('Users', userSchema)
module.exports = User