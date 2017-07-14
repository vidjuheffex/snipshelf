const app = require("../app");
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const www =require("../bin/www");

const testData = require("../config/config-test.js");

describe("API TESTS", () => {
  describe("Auth Tests", ()=>{
    it("Should login successfully", ()=>{
      return chai.request.agent(app)
        .post("/login")
        .send({username: testData.username, password: testData.password})
        .then(res => {
          expect(res).to.redirectTo(`http://127.0.0.1:${www.port}/users/snippets`);
        })
        .catch(err => {
          throw err;
        });
    });
  });
});
