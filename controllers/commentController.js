const Comments = require('../models/Comment.js')
const Article = require('../models/Article.js')

class commentController {
  static add(req, res) {
    console.log('function add comment')
    let articleId = req.params.articleId

    let newComment = {
      content: req.body.content,
      userId: req.current_token._id,
      createdAt: new Date()
    }

    Comments.create(newComment)
      .then(comment => {
        console.log(comment)
        Article.findByIdAndUpdate(
          { _id: articleId },
          { $push: { commentId: comment._id } }
        )
          .then()
          .catch()
        res.status(200).json({ comment, message: 'success add comment' })
      })
      .catch(error => {
        res.status(400).json({ error, message: error.message })
      })
  }

  static delete(req, res) {
    console.log('masuk delete comment')
    Comments.findByIdAndDelete({ _id: req.params.commentId })
      .then(comment => {
        console.log('after delete comment')
        console.log('pull comment from article', req.params.articleId)
        Article.findByIdAndUpdate(
          { _id: req.params.articleId }, { $pull: { commentId: req.params.commentId } }
        )
          .then(data => {
            res.status(200).json({ message: 'success delete comment' })
          })
          .catch(error => {
            res.status(400).json({ error, message: error.message })
          })
      })
      .catch(error => {
        res.status(400).json({ error })
      })
  }
}

module.exports = commentController