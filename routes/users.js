var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js')
const {sendUploadToGCS,multer} = require('../middlewares/upload.js')


/* GET users listing. */
router
      .post('/login',userController.login)
      .post('/register', multer.single('file'), sendUploadToGCS, userController.register)

module.exports = router;