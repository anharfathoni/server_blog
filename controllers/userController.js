const User = require('../models/User.js')
const { checkPassword } = require('../helpers/helper.js')
const jwt = require('jsonwebtoken')

class userController {
  static login(req, res) {
    let { email, password } = req.body
    User.find({ email }, function (err, user) {
      if (err) {
        res.status(400).json({ err })
      } else {
        if (user.length > 0) {
          if (checkPassword(password, user[0].password)) {
            //success login
            let token = jwt.sign({ email }, process.env.SECRET);
            res.status(200).json({ user: user[0], token, message: 'success login' })
          } else {
            res.status(400).json({ message: "wrong password" })
          }
        } else {
          // user not found
          res.status(400).json({ message: "user not found" })
        }
      }
    })
  }

  static register(req, res) {
    console.log('masuk register di controller')
    let data = JSON.parse(req.body.data)
    let { name, email, password} = data
    let avatarURL = req.file.cloudStoragePublicUrl

    let newUser = { name, email, password, avatarURL }
    User.create(newUser)
      .then(user => {
        console.log('success register')
        res.status(200).json({ user, message: "success create account, please login to continue" })
      })
      .catch(error => {
        console.log('error nih')
        res.status(400).send({ error, message: error.message })
      })
  }
}

module.exports = userController