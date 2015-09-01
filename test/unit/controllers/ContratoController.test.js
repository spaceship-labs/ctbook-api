require("sails-test-helper");
var contracts = [];
describe(TEST_NAME, function() {
  describe("GET index", function() {
    it("should return json with contracts", function(done) {
      request.get('/contrato?limit=10&skip=0&sort=importe_contrato+DESC&where=%7B%22fecha_inicio_year%22:%7B%22%3E%22:2000,%22%3C%22:2016%7D%7D')
        //request.get('/contrato')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          contracts = res.body;
          contracts.should.not.be.empty;
          contracts.length.should.equal(10);
          done();
        });
    });

    it("should return json with contracts with max limit 100", function(done) {
      request.get('/contrato?limit=200&skip=0&sort=importe_contrato+DESC&where=%7B%22fecha_inicio_year%22:%7B%22%3E%22:2000,%22%3C%22:2016%7D%7D')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          contracts = res.body;
          contracts.should.not.be.empty;
          contracts.length.should.be.at.most(100);
          done();
        });
    });

  });

  describe("GET count", function() {
    it("should return json with a count", function(done) {
      request.get('/contrato/count')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.count.should.not.be.empty.and.be.a.number;
          done();
        });
    });
  });

  describe("GET sum", function() {
    it("should return json with a sum", function(done) {
      var url = '/contrato/sum?where=%7B%22provedorContratista%22:%5B%22' + contracts[0].provedorContratista.id + '%22%5D%7D';
      request.get(url)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.sum.should.not.be.empty.and.be.a.number;
          done();
        });
    });

    it("should return json with a 0 sum when no contracts found", function(done) {
      request.get('/contrato/sum?where=%7B%22fecha_inicio_year%22:%7B%22%3E%22:1985,%22%3C%22:1999%7D,%22provedorContratista%22:%5B%22' + contracts[0].provedorContratista.id + '%22%5D%7D')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.sum.should.equal(0);
          done();
        });
    });

    it("should return an error when search too broad", function(done) {
      request.get('/contrato/sum?limit=10&skip=0&sort=importe_contrato+DESC&where=%7B%22fecha_inicio_year%22:%7B%22%3E%22:2000,%22%3C%22:2016%7D%7D')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.error.should.exist.and.equal('at least one of dependencia2, provedorContratista or unidadCompradora must be defined');
          done();
        });
    });

  });

  var contrato;
  before(function(done) {
    request.get('/contrato?limit=1&skip=0&sort=importe_contrato+DESC&where=%7B%22fecha_inicio_year%22:%7B%22%3E%22:2000,%22%3C%22:2016%7D%7D')
      .end(function(err, res) {
        if (err) throw (err);
        contrato = res.body[0];
        done();
      });

  });

  describe('CRUD methods', function() {

    describe('Delete', function() {

      it('should return forbidden', function(done) {
        request.delete('/contrato/' + contrato.id)
          .expect(403)
          .expect('Forbidden')
          .end(function(err, res) {
            if (err) throw (err);
            done();
          });
      });

    });

    describe('Update', function() {

      it('should return forbidden', function(done) {
        request.put('/contrato/' + contrato.id, {
            nombres: 'alter'
          })
          .expect(403)
          .expect('Forbidden')
          .end(function(err, res) {
            if (err) throw (err);
            done();
          });
      });

    });

    describe('Create', function() {

      it('should return forbidden', function(done) {
        request.post('/contrato/', {
            nombres: 'alter'
          })
          .expect(403)
          .expect('Forbidden')
          .end(function(err, res) {
            if (err) throw (err);
            done();
          });
      });

    });


  });

  describe('Shortcuts', function() {

    describe('Create', function() {

      it('should return 403', function(done) {
        request.get('/contrato/create?name=alter')
          .expect(404)
          .end(function(err, res) {
            if (err) throw (err);
            done();
          });

      });

    });

    describe('Update', function() {

      it('should return 404', function(done) {
        request.get('/contrato/update/' + contrato.id + '?name=alter')
          .expect(404)
          .end(function(err, res) {
            if (err) throw (err);
            done();
          });

      });

    });

    describe('Destroy', function() {

      it('should return 404', function(done) {
        request.get('/contrato/destroy/' + contrato.id)
          .expect(404)
          .end(function(err, res) {
            if (err) throw (err);
            done();
          });

      });

    });

  });


});
