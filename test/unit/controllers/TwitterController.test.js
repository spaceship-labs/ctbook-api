require("sails-test-helper");

describe(TEST_NAME, function() {
  describe("GET index", function() {
    it("should return json with tweets", function(done) {
      request.get('/twitter/')
        .query({q: '#lol'})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.length.should.be.most(40);
          done();
        });
    });
  });
})
