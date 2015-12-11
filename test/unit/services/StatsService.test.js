require("sails-test-helper");
//console.log(util.inspect(timeSeries, { showHidden: true, depth: null }));

describe(TEST_NAME, function() {
  var contracts;
  beforeEach(function() {
    contracts = [{
      dependencia: 'dep a',
      importe_contrato: 500,
      fecha_inicio_year: 2001,
      tipo_procedimiento: 'tipo a'
    },{
      dependencia: 'dep a',
      importe_contrato: 100,
      fecha_inicio_year: 2001,
      tipo_procedimiento: 'tipo a'
    },{
      dependencia: 'dep b',
      importe_contrato: 900,
      fecha_inicio_year: 2000,
      tipo_procedimiento: 'tipo b'
    }, {
      dependencia: 'dep c',
      importe_contrato: 10,
      fecha_inicio_year: 2002,
      tipo_procedimiento: 'tipo c'
    }];
  });

  describe("timeSeries", function() {
    it("should return time series", function() {
      var timeSeries = StatsService.timeSeries(contracts);
      timeSeries.length.should.equal(3);
      var expects = {
        "tipo a": [
          { year: 2000, ammount: 0},
          { year: 2001, ammount: 600},
          { year: 2002, ammount: 0}
        ],
        'tipo b': [
          { year: 2000, ammount: 900},
          { year: 2001, ammount: 0},
          { year: 2002, ammount: 0},
        ],
        'tipo c': [
          { year: 2000, ammount: 0},
          { year: 2001, ammount: 0},
          { year: 2002, ammount: 10},
        ]
      };

      timeSeries.forEach(function(ts) {
        ts.values.should.be.deep.equal(expects[ts.key]);
      });
    });
  });

  describe("agencyDistribution", function() {
    it("should return agency distribution sort by ammount", function() {
      var agencyDistribution = StatsService.agencyDistribution(contracts);
      agencyDistribution.length.should.be.equal(3);
      agencyDistribution[0].agency.should.be.equal('dep b');
      agencyDistribution[1].agency.should.be.equal('dep a');
      agencyDistribution[2].agency.should.be.equal('dep c');
      agencyDistribution[0].ammount.should.be.equal(900);
      agencyDistribution[1].ammount.should.be.equal(600);
      agencyDistribution[2].ammount.should.be.equal(10);
    });
  });

  describe("generalStats", function() {
    it("should return general stats", function() {
      var stats = StatsService.generalStats(contracts);
      stats.total.should.be.equal(1510);
      stats.limits.should.be.deep.equal({min: 10, max: 900, range: 890});
      stats.stdev.should.be.equal(353.5799061032739);
      stats.count.should.be.equal(contracts.length)
    });
  });

  describe("frequency", function() {
    it("should return err if contracts < 2", function() {
      var frequency = StatsService.frequency([]);
      frequency.error.should.be.equal("not enough datapoints");
    });

    it("should return frequency", function() {
      var frequency = StatsService.frequency(contracts)
      frequency.should.be.deep.equal([{
      key: 'Histogram',
      values: [
        {range: '0 - 0',
        frequency: 4,
        sum: 1510}
      ]}]);
    });
  });

  describe.skip("allCompanies", function() {
    it('should iterate each company', function() {
      StatsService.allCompanies();
    });
  });
});
