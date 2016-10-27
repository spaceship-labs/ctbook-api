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
    return Contrato.find({
      where: {
        dependencia2: id
      }
    }).then(function(contracts) {
      return StatsService.companyDistribution(contracts);
    });
  }
};
