const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  content: {
    type: String,
    required: [true, 'cannot add blank comment']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: Date,
  updatedAt: {
    type: Date,
    default: new Date()
  }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment