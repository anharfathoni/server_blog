const chai = require('chai')
const chaihttp = require('chai-http')
const app = require('../app.js')
const User = require('../models/User.js')
const expect = chai.expect

chai.use(chaihttp)

describe('User', function () {
  before(function(done){
    let dataNewUser = {
      name: "user1",
      email: "user1@mail.com",
      password: "123456"
    };
    User.create(dataNewUser)
    .then(user=>{
      done()
    })
  })

  after((done)=>{
    User.deleteMany({})
    .then(data => {
      done()
    });
  });

  describe('POST /user/register', function () {
      let newUser = {
        name: 'user2',
        email: 'user2@mail.com',
        password: '123456'
      }

    it('should return new Users data with response 200', function (done) {
      chai
        .request(app)
        .post('/user/register')
        .send(newUser)
        .end( function(err,res){
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.user.name).to.equal(newUser.name)
          expect(res.body.user.email).to.equal(newUser.email)
          expect(res.body.user.password).to.be.a('string')
          done()
        })
    })

    it('should return an error if email has been registered', function(done){
      chai
        .request(app)
        .post('/user/register')
        .send(newUser)
        .end( function(err,res){
          // console.log(res.body.error.errors.email.message)
          expect(res).to.have.status(400)
          expect(res.body.error).to.be.an('object')
          expect(res.body.error.errors.email.message).to.equal('email is already registered')
          done()
        })
    })

    it("should return message 'invalid name'", function(){
      newUser.name = ''
      chai
          .request(app)
          .post('/register')
          .send(newUser)
          .end(function(err,res){
            console.log({err,res})
            expect(res).to.have.status(400)
            expect(res.body.message).to.equal('name must be filled')
          })
    })

    it("should return message 'invalid email'", function(){
      newUser.email = ''
      chai
          .request(app)
          .post('/register')
          .send(newUser)
          .end(function(err,res){
            // console.log({err,res})
            expect(res).to.have.status(400)
            expect(res.body.message).to.equal('email must be filled')
          })
    })

    it("should return message 'invalid password'", function(){
      newUser.password = ''
      chai
          .request(app)
          .post('/register')
          .send(newUser)
          .end(function(err,res){
            // console.log({err,res})
            expect(res).to.have.status(400)
            expect(res.body.message).to.equal('password must be filled')
          })
    })
  })

  describe('POST /user/login', function(){
    it('should return token with response 200', function(done){
      let user = {
        email: "user1@mail.com",
        password: "123456"
      }

      chai
          .request(app)
          .post('/user/login')
          .send(user)
          .end(function(err,res) {
            // expect(err).to.be.null
            expect(res).to.have.status(200)
            // expect(res.body.token).to.be.a('string')
            done()
          })
    })

    it('should return error when password is wrong', function(done){
      let user = {
        email: "user1@mail.com",
        password: "123456xyz"
      }

      chai
          .request(app)
          .post('/user/login')
          .send(user)
          .end(function(err,res) {
            expect(res).to.have.status(400)
            expect(res.body.message).to.equal('wrong password')
            done()
          })
    })

    it('should return message user not found', function(done){
      let user = {
        email: "user1xyz@mail.com",
        password: "123456"
      }

      chai
          .request(app)
          .post('/user/login')
          .send(user)
          .end(function(err,res) {
            expect(res).to.have.status(400)
            expect(res.body.message).to.equal('user not found')
            done()
          })
    })

  })

})