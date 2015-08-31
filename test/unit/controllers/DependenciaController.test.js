require("sails-test-helper");

describe(TEST_NAME, function() {
  describe("GET index", function() {
    it("should return json for a text search", function(done) {
      request.get('/dependencia?limit=40&where=%7B%22dependencia%22:%7B%22contains%22:%22sec%22%7D%7D')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if(err) throw(err);
          res.body.should.not.be.empty;
          res.body.length.should.be.at.most(40);
          done();
        });
    });
  });
});
