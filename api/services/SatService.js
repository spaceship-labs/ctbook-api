/**
 * StatsService.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var companies = [];
module.exports = {
  //Carga listados de empresas fraudulentas a la memoria
  find: function(cb) {
    var request = require('request');
    var url = 'https://raw.githubusercontent.com/spaceship-labs/listas-negras-sat/master/json/presuntos.json';
    request.get(url, function(e, res, body) {
      companies = JSON.parse(body);
      var names = companies.map(function(company) {
        return cleanCompanyName(company["Nombre del Contribuyente"]);
      });
      //var names = names.slice(0,10);
      var mapSeries = require('promise-map-series');
      //names = ['proconnor'];
      mapSeries(names, findCompany).then(function(results) {
        var matches = results.filter(hasResults);
        cb(matches);
      });
    });
  },
  save: function() {
    SatService.find(function(matches) {
      var fs = require('fs');
      var string = JSON.stringify(matches);
      fs.writeFile("test.json", string);
    });
  },
  open : function(){
    var request = require('request');
    var url = 'https://raw.githubusercontent.com/spaceship-labs/listas-negras-sat/master/json/intersection.json';
    request.get(url,function(e,res,body){
      var companies = JSON.parse(body);
      companies.forEach(function(company){
        console.log(company.results.length,company.name);
      });
    });
  }
}

var companyStats = function(company){
  //Contracts.get({company.})
}
//Private Functions
var cleanCompanyName = function(name) {
  name = name.replace(/,? s\.?[pc]\.?r?\.? de r\.?l\.? de c\.?v\.?/ig,'');
  name = name.replace(/,? s\.? de r\.?l\.? m\.?i\.?/ig,'');
  name = name.replace(/,? s\.? de r\.?l\.? de c\.?v\.?/ig,'');
  name = name.replace(/,? ?s\.?a\.? ?\.?de c\.?v\.?/ig, '');
  return name.replace(/,? s\.?c\.?/ig,'');
}
var hasResults = function(result) {
  return result.results.length > 0 && result.results.length < 4;
}
var findCompany = function(name,key) {
  return Empresa.find({ proveedor_contratista: { contains: name } }).then(function(results) {
    console.log(key,results.length,name);
    return { name: name, results: results, record : companies[key] };
  });
}
