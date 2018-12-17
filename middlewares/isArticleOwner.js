const User = require('../models/User.js')
const Article = require('../models/Article.js')

function isArticleOwner(req,res,next){
  let articleId = req.params.id
  let userId = req.current_token._id
  // console.log(user)
  Article.find({_id: articleId, userId: userId})
  .then( article => {
    if(article) next()
    else res.status(400).send({error,message: 'is not your article'})
  })
  .catch( error => {
    res.status(400).send({error})
  })
  
}

module.exports = isArticleOwner