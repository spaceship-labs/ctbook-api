/**
 * Empresa.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    totalContractAmmount: {
      index: true
    },
    totalContractCount: {
      index: true
    },
    contracts : {
      collection : 'contrato',
      via : 'provedorContratista'
    }
  },

  saveSatMatch: function(match) {
    var q = require('q');
    var deferred = q.defer();
    var ids = match.results.map(function(match) {
      return match.id;
    });
    var update = {};
    var num = match.record['No.'];
    delete match.record['No.'];
    match.record['num'] = num; 
    update[match.record['Situación del Contribuyente']] = match.record;
    Empresa.update(ids, update).then(deferred.resolve);
    return deferred.promise;
  }

};
