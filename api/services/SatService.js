/**
 * StatsService.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var companies = [];
var q = require('q');
var mapSeries = require('promise-map-series');

module.exports = {
  intersect: function(list) {
    var deferred = q.defer();
    var url = 'https://raw.githubusercontent.com/spaceship-labs/listas-negras-sat/master/json/' + list + '.json';
    var nameKey = list === 'no-localizados' ? 'Nombre, Denominación o Razón Social' : 'Nombre del Contribuyente';
    JsonService.load(url)
      .then(function(comps) {
        companies = comps;
        var names = companies.map(function(company) {
          return cleanCompanyName(company[nameKey]);
        });
        //names = names.slice(0,60);
        mapSeries(names, findCompany).then(function(results) {
          var matches = results.filter(hasResults);
          deferred.resolve(matches);
        });
      });
    return deferred.promise;
  },

  saveIntersection: function(list) {
    SatService.intersect(list)
      .then(function(matches) {
        return JsonService.save(matches, 'exports/' + list + '-intersection.json');
      });
  },

  saveDB: function(list) {
    var deferred = q.defer();
    var url = 'https://raw.githubusercontent.com/spaceship-labs/listas-negras-sat/master/json/' + list + '-intersection.json';
    JsonService.load(url)
      .then(function(matches) {
        var operations = matches.map(Empresa.saveSatMatch);
        return q.all(operations);
      });
  },


  //needs refactor
  dates: function() {
    SatService.open().then(function(companies) {
      var operations = companies.map(getContracts);
      q.all(operations).then(function(contracts) {
        contracts.forEach(function(set, key) {
          var company = companies[key];
          var date = new Date(company.record['Publicación página SAT presuntos']);
          var remaining = set.filter(function(contract) {
            if (contract.fecha_inicio.split('/').length == 3) {
              var contractDate = new Date(contract.fecha_inicio.split('/').reverse().join('-'));
            } else {
              var contractDate = new Date(contract.fecha_inicio);
            }
            return contractDate >= date;
          });
          if (remaining.length)
            console.log(remaining.length);
        });
      });
    });
  },

  dependenciass: function(status) {
    var condition = status === 'definitivo' ? { definitivo: { '!': null } } :
      status === 'presunto' ? { presunto: { '!': null } } : { 'no-localizado': { '!': null } };
    Empresa.find(condition).then(function(companies) {
      var ids = companies.map(function(company){
        return company.id;
      });
      Contrato.find({provedorContratista:ids}).then(StatsService.agencyDistribution).then(function(stats){
        console.log(stats);
      });
    })
  },

  dependencias: function(list) {
    var deferred = q.defer();
    var url = 'https://raw.githubusercontent.com/spaceship-labs/listas-negras-sat/master/json/' + list + '-intersection.json';
    var nameKey = list === 'no-localizados' ? 'Nombre, Denominación o Razón Social' : 'Nombre del Contribuyente';
    JsonService.load(url)
      .then(function(companies) {
        var operations = companies.map(getContracts);
        var dependencias = [];
        q.all(operations).then(function(contracts) {
          console.log(contracts.length);
          contracts.forEach(function(set, key) {
            set.forEach(function(contract) {
              if (dependencias[contract.dependencia2]) {
                dependencias[contract.dependencia2].contracts++;
                dependencias[contract.dependencia2].sum += contract.importe_contrato;
              } else {
                dependencias[contract.dependencia2] = {
                  contracts: 1,
                  sum: contract.importe_contrato,
                  name: contract.dependencia,
                }
              }
            });
          });

          //console.log('whut');
          depdendencias = Object.keys(dependencias).map(key => dependencias[key]).forEach(function(dep) {
            console.log("'" + dep.name + "','" + dep.contracts + "','" + dep.sum + "'");
          });

        });
      });
  }
}

var getContracts = function(company) {
  var ids = [];
  if (company.results.length <= 2) {
    company.results.forEach(function(result) {
      ids.push(result.id);
    });
    return Contrato.find({ where: { provedorContratista: ids } });
  } else {
    return [];
  }
}

//Private Functions
var cleanCompanyName = function(name) {
  name = name.replace(/,? s\.?[pc]\.?r?\.? de r\.?l\.? de c\.?v\.?/ig, '');
  name = name.replace(/,? s\.? de r\.?l\.? m\.?i\.?/ig, '');
  name = name.replace(/,? s\.? de r\.?l\.? de c\.?v\.?/ig, '');
  name = name.replace(/,? ?s\.?a\.? ?\.?de c\.?v\.?/ig, '');
  return name.replace(/,? s\.?c\.?/ig, '');
}
var hasResults = function(result) {
  return result.results.length > 0 && result.results.length < 4;
}
var findCompany = function(name, key) {
  return Empresa.find({ proveedor_contratista: { contains: name } }).then(function(results) {
    console.log(key, results.length, name);
    return { name: name, results: results, record: companies[key] };
  });
}
