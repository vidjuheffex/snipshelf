const app = require("../app");
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const testData = require("../config/config-test.js");

/*let status = app.get("mongoose-status");
  while(!status){
  status = app.get("mongoose-status");
  console.log(status);
  };*/
const mongoose = require('mongoose');

describe("API TESTS", () => {
  describe("Auth and User Crud Tests", ()=>{
    before(function(done){
      mongoose.connection.on('connected', done);
    });
    describe("Login", ()=>{
      it("Should login successfully and redirect to 'users/snippets'", ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/login")
          .send({username: testData.username, password: testData.password})
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
    describe("Signup", ()=>{
      it("Should signup successfully", ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/signup")
          .send({username: testData.tempName, password: testData.tempPassword, passwordConfirm: testData.tempPassword})
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
  });
  describe("Snippet CRUD Tests", ()=>{
    describe("Create a Snippet", ()=>{
      it("Should sucessfully create a snippet", ()=>{
        var agent = chai.request.agent(app);
        return agent
          .post("/login")
          .send({username: testData.username, password: testData.password})
          .then(res => {
            return agent
              .post("/users/snippets")
              .send({title: "test snippet", language: "javascript", "document": "dfdsfdsf"})
              .then(res => {
                expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/users/snippets`);
              });
          })
          .catch(err => {
            throw err;
          });
      });
    });
  });
});
