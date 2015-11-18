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
          ammount: getSeries(_contracts, {
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

  }
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

var getSeries = function(contracts, params) {
  return contracts.find(params).map(function(contract) {
    return contract.importe_contrato
  }).toVector().sum();
}
