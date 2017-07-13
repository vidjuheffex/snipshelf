const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe("API TESTS", () => {
  describe("Simple test", ()=>{
    it("should return true", ()=>{
      expect(5).to.equal(5);
    });
  });
});
