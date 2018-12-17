const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
  title: String,
  body: {
    type: String,
    validate: [{
      isAsync: true,
      validator: function (value, cb) {
        Article.findOne({ body: value }, function (err, res) {
          cb(!res)
        })
      },
      message: `body articles have been published`
    }]
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  commentId: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: String(new Date())
  },
  imageURL: String
})

const Article = mongoose.model('Article',articleSchema)

module.exports = Article