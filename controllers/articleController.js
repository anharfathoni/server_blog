const Article = require('../models/Article.js')

class articleController{
  static create(req,res){
    let data = JSON.parse(req.body.data)

    let {title,body} = data
    let createdAt = new Date()
    let userId = req.current_token._id
    let imageURL = req.file.cloudStoragePublicUrl

    console.log('masuk create function Article')
    Article.create({title,body,createdAt,userId,imageURL})
    .then( article => {
      res.status(200).json({article, message: "success create Article"})
    })
    .catch( error => {
      res.status(400).json({error, message: error.message})
    })
  }

  static showAllArticle(req,res){
    Article.find({})
    .populate('userId')
    .populate({
      path : 'commentId', 
      populate : {path : 'userId', select: 'name'}
    })
    .sort([['updatedAt', -1]])
    .then( articles => {
      res.status(200).json({articles})
    })
    .catch( error => {
      res.status(400).json({error})
    })
  }

  static showMyArticle(req,res){
    Article.find({userId: req.current_token._id})
    .sort([['updatedAt', -1]])
    .then( articles => {
      console.log(articles) 
      res.status(200).json({articles})
    })
    .catch( error => {
      res.status(400).json({error})
    })
  }

  static showDetails(req,res){
    console.log(req.params.articleId)
    Article.findOne({_id: req.params.articleId})
    .populate('userId')
    .populate({
      path : 'commentId', 
      populate : {path : 'userId'},
    })
    // .sort([['updatedAt', -1]])
    .then( article => {
      console.log("details artikelnya")
      console.log(article)
      res.status(200).json({article})
    })
    .catch( error => {
      res.status(400).json({error})
    })
  }

  static edit(req,res){
    console.log(req.body)
    let data = JSON.parse(req.body.data)
    let {title,body,updatedAt} = data
    let imageURL = req.file.cloudStoragePublicUrl

    let editArticle = {title,body,updatedAt,imageURL}
    Article.findByIdAndUpdate({_id:req.params.id}, editArticle)
    .then( article => {
      res.status(200).json({article, message: "success edit Article"})
    })
    .catch( error => {
      res.status(400).json({error})
    })
  }

  static delete(req,res){
    console.log(req.body)
    Article.findByIdAndDelete({_id:req.params.id})
    .then( article => {
      res.status(200).json({article, message: 'success delete article'})
    })
    .catch( error => {
      res.status(400).json({error})
    })
  }

}

module.exports = articleController