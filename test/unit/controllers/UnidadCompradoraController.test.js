require("sails-test-helper");

describe(TEST_NAME, function() {
  describe("GET index", function() {
    it("should return json for a text search", function(done) {
      request.get('/unidadCompradora?limit=40&where=%7B%22nombre_de_la_uc%22:%7B%22contains%22:%22sec%22%7D%7D')
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

  var unidadCompradora;
  before(function(done){
    request.get('/unidadCompradora?limit=1&where=%7B%22nombre_de_la_uc%22:%7B%22contains%22:%22sec%22%7D%7D')
      .end(function(err, res){
        if(err) throw(err);
        unidadCompradora = res.body[0];
        done();
      });

  });

  describe('CRUD methods', function(){

    describe('Delete', function(){

      it('should return forbidden', function(done){
        request.delete('/unidadCompradora/'+unidadCompradora.id)
          .expect(403)
          .expect('Forbidden')
          .end(function(err, res){
            if(err) throw(err);
            done();
          });
      });

    });

    describe('Update', function(){

      it('should return forbidden', function(done){
        request.put('/unidadCompradora/'+unidadCompradora.id, {nombres:'alter'})
          .expect(403)
          .expect('Forbidden')
          .end(function(err, res){
            if(err) throw(err);
            done();
          });
      });

    });

    describe('Create', function(){

      it('should return forbidden', function(done){
        request.post('/unidadCompradora/', {nombres:'alter'})
          .expect(403)
          .expect('Forbidden')
          .end(function(err, res){
            if(err) throw(err);
            done();
          });
      });

    });


  });

  describe('Shortcuts', function(){

    describe('Create', function(){

      it('should return 404', function(done){
        request.get('/unidadCompradora/create?name=alter')
          .expect(404)
          .end(function(err, res){
            if(err) throw(err);
            done();
          });

      });

    });

    describe('Update', function(){

      it('should return 404', function(done){
        request.get('/unidadCompradora/update/'+unidadCompradora.id+'?name=alter')
          .expect(404)
          .end(function(err, res){
            if(err) throw(err);
            done();
          });

      });

    });

    describe('Destroy', function(){

      it('should return 404', function(done){
        request.get('/unidadCompradora/destroy/'+unidadCompradora.id)
          .expect(404)
          .end(function(err, res){
            if(err) throw(err);
            done();
          });

      });

    });

  });

});
