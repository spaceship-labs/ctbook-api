/* globals Contrato */
/**
 * ContratoController
 *
 * @description :: Server-side logic for managing contratoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  sum: function(req, res) {
    var params = prepareParams(req);
    var response = {
      error: 'at least one of dependencia2, provedorContratista or unidadCompradora must be defined'
    };
    if (params.where) {
      params.where = JSON.parse(params.where);
      if (params.where.dependencia2 || params.where.provedorContratista || params.where.unidadCompradora) {
        if (!params.where.moneda) {
          params.where.moneda = 'MXN';
        }

        Contrato.find(params).sum('importe_contrato').exec(function(e, result) {
          var sum = result.length ? result[0].importe_contrato : 0;
          response = {
            sum: sum,
            moneda: params.where.moneda
          };
          res.json(response);
        });
      } else {
        res.json(response);
      }
    } else {
      res.json(response);
    }
  },

  stats: function(req, res) {
    var params = prepareParams(req);
    var response = {
      error: 'at least one of dependencia2, provedorContratista or unidadCompradora must be defined'
    };
    if (params.where) {
      params.where = JSON.parse(params.where);

      Contrato.find(params).exec(function(e, contracts) {
        res.json({
          timeSeries: StatsService.timeSeries(contracts),
          agencyDistribution: StatsService.agencyDistribution(contracts),
          generalStats: StatsService.generalStats(contracts),
          frequency: StatsService.frequency(contracts),
        });
      });

    } else {
      res.json(response);
    }
  }
}

var prepareParams = function(req) {
  var params = req.params.all();
  delete params.id;
  delete params.limit;
  delete params.skip;
  delete params.sort;
  return params;
}
