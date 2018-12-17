const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articleController.js')
const auth = require('../middlewares/auth.js')
const isArticleOwner = require('../middlewares/isArticleOwner.js')
const {sendUploadToGCS,multer} = require('../middlewares/upload.js')

router
      .get('/', articleController.showAllArticle)
      .get('/myarticle', auth.authentication, articleController.showMyArticle)
      .get('/:articleId', articleController.showDetails)
      .post('/', auth.authentication, multer.single('file'), sendUploadToGCS, articleController.create)
      .put('/:id', auth.authentication, isArticleOwner, multer.single('file'), sendUploadToGCS, articleController.edit)
      .delete('/:id', auth.authentication, isArticleOwner, articleController.delete)

module.exports = router