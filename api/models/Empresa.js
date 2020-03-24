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
    contracts: {
      collection: 'contrato',
      via: 'provedorContratista'
    }
  },
  //TODO  borrar manualmente en la DB registros con "undefined" y "Definitivo" (mayuscula)
  saveSatMatch: function (match) {
    var q = require('q');
    var deferred = q.defer();
    var ids = match.results.map(function (match) {
      return match.id;
    });
    var status = match.record['Situación del Contribuyente'] ? 'definitivo' :
      match.record['Situación del contribuyente'] ? 'presunto' : 'no-localizado';
    var update = {};
    var idKey = status === 'no-localizado' ? 'N°' : 'No.';
    var num = match.record[idKey];
    delete match.record[idKey];
    match.record.num = num;
    update[status] = match.record;
    console.log('saving', match.record);
    Empresa.update(ids, update).then(deferred.resolve);
    return deferred.promise;
  },
  getBlacklisted: function (status) {
    var condition = {};
    condition[status] = { '!': null };
    return Empresa.find(condition);
  },
  getCompaniesWithContracts: function () {
    return new Promise(function (res, rej) {
      Contrato.native(function (err, coll) {
        if (err) {
          console.log('Can not use collection directly');
        }
        coll.distinct('provedorContratista', function (qryErr, results) {
          if (qryErr) {
            console.log('Error during query for contracts companies');
            rej(qryErr);
          }

          const strResults = results.map(item => String(item));
          res(strResults);
        })
      })
    });
  },
  getAllCompaniesIds: function () {
    return new Promise(function (res, rej) {
      Empresa.find({ select: ['id'] }).exec(function (err, results) {
        if (err) {
          console.log('Error while trying to fetch all companies ids');
          rej(err);
        }
        const strResults = results.map(item => item.id);
        res(strResults);
      })
    })
  },
  getCompaniesWithNoContracts: function () {
    return new Promise((resolve, reject) => {
      Promise.all([
        Empresa.getCompaniesWithContracts(),
        Empresa.getAllCompaniesIds()
      ]).then((responses) => {
        const [usedCompanies, allCompanies] = responses;

        const mapUsedCompanies = usedCompanies.reduce((acc, it) => {
          acc[it] = true;
          return acc;
        }, {});

        const unusedCompanies = allCompanies.filter((item) => !mapUsedCompanies[item]);

        resolve(unusedCompanies);
      }).catch(err => reject(err));
    })
  },
};
