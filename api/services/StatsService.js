/**
 * StatsService.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var gauss = require('gauss');

module.exports = {
  timeSeries: function(contracts) {
    collection = gauss.Collection;
    var _contracts = new collection(contracts);
    var limits = getMinMaxYears(_contracts);
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
    return values.sort(function(a, b) {
      if (a.ammount > b.ammount) {
        return -1;
      }
      if (a.ammount < b.ammount) {
        return 1;
      }
      return 0;
    });


  }

}

var getAgencies = function(contracts) {
  return contracts.map(function(contract) {
    return contract.dependencia
  }).unique();
}

var getProcedureTypes = function(contracts) {
  return contracts.map(function(contract) {
    return contract.tipo_procedimiento
  }).unique();
}

var getMinMaxYears = function(contracts) {
  var vector =
    contracts.map(function(contract) {
      return contract.fecha_inicio_year;
    }).toVector();
  return {
    min: vector.min(),
    max: vector.max()
  };
}

var getSum = function(contracts, params) {
  return contracts.find(params).map(function(contract) {
    return contract.importe_contrato
  }).toVector().sum();
}
