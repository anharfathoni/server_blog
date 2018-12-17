const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController.js')
const auth = require('../middlewares/auth.js')
const isCommentOwner = require('../middlewares/isCommentOwner.js')

router
      .post('/:articleId', auth.authentication, commentController.add)
      .delete('/:commentId/:articleId', auth.authentication, isCommentOwner, commentController.delete)

module.exports = router