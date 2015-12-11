require("sails-test-helper");
var contracts = [];
var where = {
  fecha_inicio_year: {
    ">=": 2000,
    "<=": 2016
  }
}
var defaultQuery = {
  limit: 10,
  skip: 0,
  sort: 'importe_contrato DESC',
  where: JSON.stringify(where)
};

describe(TEST_NAME, function() {
  describe("GET index", function() {
    it("should return json with contracts", function(done) {
      request.get('/contrato')
        .query(defaultQuery)
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
      defaultQuery.limit = 200;
      request.get('/contrato')
        .query(defaultQuery)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          contracts = res.body;
          contracts.should.not.be.empty;
          contracts.length.should.be.at.most(100);
          defaultQuery.limit = 10;
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
      var where = {
        provedorContratista: [contracts[0].provedorContratista.id]
      };
      var url = '/contrato/sum';
      request.get(url)
        .query({
          where: JSON.stringify(where)
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.sum.should.not.be.empty.and.be.a.number;
          done();
        });
    });

    it("should return json with a 0 sum when no contracts found", function(done) {
      var where = {
        provedorContratista: ['nonexistentid'],
        moneda : 'MXN'
      };

      request.get('/contrato/sum')
        .query({
          where: JSON.stringify(where)
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.sum.should.equal(0);
          done();
        });
    });

    it("should return an error when search too broad", function(done) {
      request.get('/contrato/sum')
        .query(defaultQuery)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.error.should.exist.and.equal('at least one of dependencia2, provedorContratista or unidadCompradora must be defined');
          done();
        });
    });


    it("should return an error when no where params", function(done) {
      request.get('/contrato/sum')
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

  describe("GET stats", function() {
    it("should return json with stats", function(done) {
      request.get('/contrato/stats')
        .query({
          where: JSON.stringify({
            fecha_inicio_year: {
              ">=": 2000,
              "<=": 2016
            },
            limit: 10
          })
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.should.be.have.property('timeSeries');
          res.body.should.be.have.property('agencyDistribution');
          res.body.should.be.have.property('generalStats');
          res.body.should.be.have.property('frequency');
          done();
        });
    });

    it("should return err if no params", function(done) {
      request.get('/contrato/stats')
        .query({})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) throw (err);
          res.body.error.should.be.exist;
          done();
        });
    });
  });


});
