/**
 * StatsService.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var gauss = require('gauss');
var histogram = require('histogramjs');
var counter = 0;

module.exports = {
  removeUnusedCompanies: function () {
    Empresa.getCompaniesWithNoContracts().then(function (ids) {
      Empresa.destroy({ id: ids }).exec((err) => {
        if (err) {
          console.log('Error during destroy');
        }
        console.log('Done!');
      })
    }).catch((err) => {
      console.log('Error getting unused companies:');
      console.log(err);
    })
  }
};
