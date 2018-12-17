const Comments = require('../models/Comment.js')

function isCommentOwner(req,res,next) {
  let commentId = req.params.commentId
  Comments.findById({_id: commentId})
  .then( comment => {
    console.log(comment)
    console.log([String(comment.userId), String(req.current_token._id)])
    if(String(comment.userId) == String(req.current_token._id)){
      console.log('--- comment owner ---')
      next()
    } else {
      console.log('that isnt your comment')
      res.status(400).json({message: 'cannot delete this comment, this isnt your comment'})
    }

  })
  .catch( error => {
    res.status(400).json({error})
  })
}

module.exports = isCommentOwner