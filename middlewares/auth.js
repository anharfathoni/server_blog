const jwt = require('jsonwebtoken')
const User = require('../models/User.js')

function authentication(req,res,next){
    console.log('masuk authentication')
    let token = req.headers.authorization
    jwt.verify(token,process.env.SECRET, function(error, decoded){
      if(error){
        res.status(400).send({error, message: 'user not found, please login'})
      } else {
        User.findOne({
          email: decoded.email
        })
        .then(user => {
          req.current_token = user
          console.log('currentToken', req.current_token)
          next() 
        })
        .catch( error =>{
          // console.log(error)
          res.status(400).send({error, message: 'user not found, please login'})
        })
      }
    })
}


module.exports = {
  authentication
}