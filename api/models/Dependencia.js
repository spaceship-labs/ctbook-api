/**
 * Dependencia.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    /*contratos : {
      collection : 'contrato',
      via : 'dependencia',
    }*/
    unidades: {
      collection: 'unidadCompradora',
      via: 'dependencia'
    }
  },
  favorites: function(id) {
    console.log(id);
    return Contrato.find({
      where: {
        dependencia2: id
      }
    }).populate('provedorContratista').then(function(contracts) {
      console.log('found ', contracts.length);
      return StatsService.companyDistribution(contracts);
    });
  },
  blacklisted: function(id,status) {
    var q = require('q');
    var deferred = q.defer();
    var clause = {};
    clause[status] = { "!": null }; 
    Empresa.find()
      .where(clause)
      .populate('contracts', { dependencia2: id })
      .then(function(companies) {
        var filtered = companies.filter(function(company) {
          return company.contracts.length
        });
        deferred.resolve(filtered);
      })
      return deferred.promise;
  }
};
