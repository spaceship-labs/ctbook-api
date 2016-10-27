/**
 * StatsService.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var gauss = require('gauss');
var histogram = require('histogramjs');
var counter = 0;

module.exports = {
  timeSeries: function(contracts) {
    collection = gauss.Collection;
    var _contracts = new collection(contracts);
    var limits = getMinMax(_contracts, 'fecha_inicio_year');
    var series = [];
    var types = getProcedureTypes(_contracts);

    for (var j = 0; j < types.length; j++) {
      var values = [];
      for (var i = limits.min; i <= limits.max; i++) {
        values.push({
          year: i,
          ammount: getSum(_contracts, {
            fecha_inicio_year: i,
            tipo_procedimiento: types[j]
          })
        });
      }
      series.push({
        key: types[j],
        values: values
      });
    }
    return series;

  },
  agencyDistribution: function(contracts) {
    collection = gauss.Collection;
    var _contracts = new collection(contracts);
    var agencies = getAgencies(_contracts);
    var values = [];
    for (var i = 0; i < agencies.length; i++) {
      values.push({
        agency: agencies[i],
        ammount: getSum(_contracts, {
          dependencia: agencies[i]
        })
      });
    }
    return values.sort(sort);
  },
  companyDistribution: function(contracts) {
    collection = gauss.Collection;
    var _contracts = new collection(contracts);
    var companies = getCompanies(_contracts);
    var values = [];
    for (var i = 0; i < companies.length; i++) {
      var company = companies[i].split('|')[0];
      var id = companies[i].split('|')[1];
      values.push({
        company: company,
        id: id,
        ammount: getSum(_contracts, {
          provedorContratista: id
        })
      });
    }
    return values.sort(sort);
  },
  generalStats: function(contracts) {
    collection = gauss.Collection;
    var _contracts = new collection(contracts);

    return {
      total: getSum(_contracts),
      count: contracts.length,
      mean: getMean(_contracts),
      limits: getMinMax(_contracts, 'importe_contrato'),
      stdev: _contracts.map(mapAmmount).toVector().stdev()
    }
  },

  frequency: function(contracts) {
    if (contracts.length > 2) {
      var _contracts = new gauss.Collection(contracts);
      var data = _contracts.map(mapAmmount).toVector();

      var hist = binData(data);
      var chart = chartHist(hist);

      return chart;

    } else {
      return {
        error: 'not enough datapoints'
      };
    }
  },
  allCompanies: function(pageInit, done) {
    pageInit = pageInit || 0;
    var limit = 500;
    Empresa.count().exec(function(err, total) {
      if(err) return sails.log.error(err) && done && done(err);;
      var times = Math.ceil(total / limit);
      async.timesSeries(times, findCompanyAndSaveStats(pageInit, limit), function(err, processed) {
        if (err) sails.log.error(err) && done && done(err);
        var counter = 0;
        processed.forEach(function(pr) {
          counter += pr.length;
        });
        if (done) return done(null, counter);
        sails.log.info("processed: "+ counter + ', total: '+ total);
      });
    });

  }
}

var findCompanyAndSaveStats = function(pageInit, limit) {
  return function(page, next) {
    if (page < pageInit) return next(null, []);
    Empresa.find().paginate({page: page + 1, limit: limit}).exec(function(e, companies) {
      async.map(companies, saveCompanyStats, function(e, companiesUpdate){
        sails.log.info("page processed: "+ page);
        next(null, companies.map(function (c) {
          return c && c.id;
        }));
      });
    });
  }
};

var saveCompanyStats = function(company,cb) {
  Contrato.find({
    where: {
      provedorContratista: company.id
    }
  }).exec(function(e,contracts){
    var stats = StatsService.generalStats(contracts);
    Empresa.update(company.id,{
      totalContractAmmount : stats.total,
      totalContractCount : stats.count,
      contractsMean : stats.mean,
      contractsStdev : stats.stdev,
      contractsMin : stats.limits.min,
      contractsMax : stats.limits.max
    },cb);
  });
}

var chartHist = function(hist) {
  var chart = {
    key: "Histogram",
    values: []
  };
  for (var i = 0; i < hist.data.length; i++) {
    var sum = new gauss.Vector(hist.data[i]).sum();
    chart.values.push({
      range: Math.round(hist.bins[i] / 100000) / 10 + ' - ' + Math.round(hist.bins[i + 1] / 100000) / 10,
      frequency: hist.data[i].length,
      sum: sum
    });
  }
  return [chart];
}

var binData = function(data) {
  //Sotts rule
  var min = data.min();
  var max = data.max();
  var h = (3.5 * (data.stdev())) / Math.pow(data.length, 1 / 3);
  var k = Math.ceil((max - min) / h);
  var bins = linspace(min, max, k);

  var hist = histogram({
    data: data,
    bins: bins
  });

  for (var i = 0; i < hist.length; i++) {
    var values = hist[i];
    //if the bin contains more than 50% of the points split that section into smaller bins :D
    if (values.length / data.length > .6 && values.length < data.length) {
      var vector = new gauss.Vector(values);
      var newHist = binData(values);
      //This is so that the array is spliced on the same level as oposed to inserted as an elemnt (splice an array into an array)
      var args = [i, 1].concat(newHist.data);
      // This shit's because when you splice in the bins you already got the first value (or you could also have the last)
      newHist.bins.splice(0, 1);
      var args2 = [i + 1, 1].concat(newHist.bins);
      Array.prototype.splice.apply(hist, args);
      Array.prototype.splice.apply(bins, args2);
    }
  }
  return {
    data: hist,
    bins: bins
  }


}

var sort = function(a, b) {
  if (a.ammount > b.ammount) {
    return -1;
  }
  if (a.ammount < b.ammount) {
    return 1;
  }
  return 0;
}
var mapAmmount = function(contract) {
  return contract.importe_contrato
}
var getMean = function(contracts, params) {
  if (params) contracts = contracts.find(params);
  return contracts.map(mapAmmount).toVector().mean()
}
var getAgencies = function(contracts) {
  return contracts.map(function(contract) {
    return contract.dependencia
  }).unique();
}
var getCompanies = function(contracts) {
  return contracts.map(function(contract) {
    return contract.proveedor_contratista+"|"+contract.provedorContratista;
  }).unique();
}

var getProcedureTypes = function(contracts) {
  return contracts.map(function(contract) {
    return contract.tipo_procedimiento;
  }).unique();
}

var getMinMax = function(contracts, property,params) {
  if (params) contracts = contracts.find(params);
  var vector =
    contracts.map(function(contract) {
      return contract[property];
    }).toVector();
  return {
    min: vector.min(),
    max: vector.max(),
    range: vector.range()
  };
}

var getSum = function(contracts, params) {
  if (params) contracts = contracts.find(params);
  return contracts.map(mapAmmount).toVector().sum();
}

var linspace = function(a, b, n) {
  if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
  if (n < 2) {
    return n === 1 ? [a] : [];
  }
  var i, ret = Array(n);
  n--;
  for (i = n; i >= 0; i--) {
    ret[i] = (i * b + (n - i) * a) / n;
  }
  return ret;
}
