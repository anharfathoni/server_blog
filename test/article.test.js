const chai = require('chai')
const chaihttp = require('chai-http')

const app = require('../app.js')
const expect = chai.expect
const Article = require('../models/Article.js')
const User = require('../models/User.js')
const jwt = require('jsonwebtoken')

chai.use(chaihttp)

describe('Article', function(){
  let newArticle = {
    title: 'tes title 2',
    body: 'tes body 2'
  }
  let token = ''
  let token2 = 'abc'

  before((done)=>{
    Article.create({title: 'tes title 1', body: 'tes body 1'})

    let dataNewUser = {
      name: "user3",
      email: "user3@mail.com",
      password: "123456"
    };
    User.create(dataNewUser)
    .then( user => {
      token = jwt.sign({ email: user.email }, process.env.SECRET);
      // console.log(token)
      done()
    })
  })

  after((done)=>{
    Article.deleteMany({}).then( data => {})
    User.deleteMany({}).then( data => {})
    done()
  })

  describe('POST /article', function(){
    it('should return new article with status 200', function(done){
      chai
          .request(app)
          .post('/article')
          .send(newArticle)
          .set({
            authorization : token
          })
          .end(function(err,res){
            // console.log([res.status,res.body.article.title,res.body.article.body])
            expect(res).to.have.status(200)
            expect(res.body.article).to.be.an('object')
            expect(res.body.article.title).to.equal(newArticle.title)
            expect(res.body.article.body).to.equal(newArticle.body)
            done()
          })
    })

    it('should return error if article body is the same', function(done){
      newArticle.body = 'tes body 1'
      console.log(newArticle)
      chai
          .request(app)
          .post('/article')
          .send(newArticle)
          .set({
            authorization : token
          })
          .end( function(err,res){
            expect(res).to.have.status(400)
            expect(res.body.error).to.be.an('object')
            expect(res.body.error.errors.body.message).to.equal('body articles have been published')
            done()
          })
    })
  })

  describe('GET /article', function(){
    it('should get all the articles',function(done){
      chai.request(app)
          .get('/article')
          .end(function(err,res){
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body.articles).to.be.an('array')
            done()
          })
    })
  })

  describe('PUT /article', function(){
    it('should success update the article',function(done){
      chai
          .request(app)
          .put(`/article/${articleId}`)
          .send(articleData)
          .set({
            authorization: token
          })
          .end((req, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('message')
            expect(res.body.message).to.equal('success edit Article')
            done()
          })
    })

    it("should return msg 'failed updating article' if user updating another user article", function(done) {
      chai
        .request(app)
        .put(`/article/${articleId}`)
        .send(articleData)
        .set({
          authorization: token2
        })
        .end((req, res) => {
          expect(res).to.have.status(403)
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('is not your article')
          done()
        })
    })
  })

  describe('DELETE /article', function(){
    it(`should return success deleting article`, function(done) {
      chai
        .request(app)
        .delete(`/article/${articleId}`)
        .set({
          authorization: token
        })
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal(`success delete article`)
          done()
        })
    })

    it("should return 'failed deleting article' if user deleting another user article", function(done) {
      chai
        .request(app)
        .delete(`/article/${articleId}`)
        .set({
          authorization: token2
        })
        .end((err, res) => {
          expect(res).to.have.status(403)
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('is not your article')
          done()
        })
    })
  })
})