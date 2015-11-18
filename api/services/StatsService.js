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
    var years = [];
    var ammounts = [];
    for (var i = limits.min; i <= limits.max; i++) {
      years.push(i);
      ammounts.push(getTotalForYear(i, _contracts));
    }
    return {
      years: years,
      ammounts: ammounts
    };

  }
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

var getTotalForYear = function(year, contracts) {
  return contracts.find({
    fecha_inicio_year: year
  }).map(function(contract) {
    return contract.importe_contrato
  }).toVector().sum();
}
