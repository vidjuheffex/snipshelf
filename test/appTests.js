const app = require("../app");
const chai = require('chai');
const chaiHttp = require('chai-http');
var chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiAsPromised);
chai.should();
const secret = require('../config/config-secret.js');

const testData = require("../config/config-test.js");

const mongoose = require('mongoose');
const Snippet = require('../models/Snippet');
const User = require('../models/User');

before(function(done){
  mongoose.connection.on('connected', done);
});

describe("API TESTS", () => {
 
  describe("Auth and User Crud Tests", ()=>{
    
    describe("Signup", ()=>{
      it("Should signup successfully", ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/signup")
          .send({username: testData.tempName, password: testData.tempPassword, passwordConfirm: testData.tempPassword, secret: secret})
          .then(res => {
            expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/login`);
          })
          .catch( err => {
            throw err;
          });
      });
      it("Should fail signup for username not being unique", ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/signup")
          .send({username: testData.username, password: testData.password, passwordConfirm: testData.password})
          .then(res => {
            expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/signup`);
          })
          .catch(err => {
            throw err;
          });
      });
    });
    
    describe("Login", ()=>{
      it("Should login successfully and redirect to 'users/snippets'", ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/login")
          .send({username: testData.tempName, password: testData.tempPassword})
          .then(res => {
            expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/users/snippets`);
          })
          .catch(err => {
            throw err;
          });
      });
      it("Should fail for not finding a username, and redirect back to login", ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/login")
          .send({username: Math.random()*100*1000, password: ""})
          .then(res => {
            expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/login`);
          })
          .catch( err => {
            throw err;
          }); 
      });
      it("Should fail for having an incorrect password, and redirect back to login", ()=>{
        var agent= chai.request.agent(app);
        return agent
          .post("/login")
          .send({username: testData.username, password: "12345"})
          .then(res=>{
            expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/login`);
          })
          .catch( err => {
            throw err;
          }); 
      });
    }); 
  });
  describe("Snippet CRUD Tests", ()=>{
    describe("Create a Snippet", ()=>{
      it("Should sucessfully create a snippet", ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/login")
          .send({username: testData.tempName, password: testData.tempPassword})
          .then(res => {
            return agent
              .post("/users/snippets")
              .send({title: "11222zzxcvtest_snippet", language: "javascript", "document": "document"})
              .then(res => {
                expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/users/snippets`);
                Snippet.findOne({title: "11222zzxcvtest_snippet"}).should.eventually.be.an("Object");
              });
          })
          .catch(err => {
            throw err;
          });
      });
    });
    describe("Delete a Snippet", ()=>{
      let resultSnip = "";
      before(function(done){
        Snippet.findOne({
          title: "11222zzxcvtest_snippet"
        }, function(err, res){
          if(!err){
            resultSnip = res._id; 
            done();  
          }
          else{
            throw err;
          }
        });
      });
      it("Should sucessfully delete a snippet " + resultSnip, ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/login")
          .send({username: testData.tempName, password: testData.tempPassword})
          .then(res => {
            return agent
              .delete("/users/snippets/" + resultSnip)
              .then(res => {
                expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/users/snippets`);
              });
          })
          .catch(err =>{
            throw err;
          });
      });
    });
  }); 
});
