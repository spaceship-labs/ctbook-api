/**
 * Contrato.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    dependencia2: {
      model: 'dependencia',
      index: true,
    },
    unidadCompradora: {
      model: 'unidadCompradora',
      index: true,
    },
    provedorContratista: {
      model: 'empresa',
      index: true,
    },
    importe_contrato: {
      index: true,
      type: 'float'
    },
    date: function() {
      var string = this.fecha_inicio.split('/').length == 3 ? this.fecha_inicio.split('/').reverse().join('-') : this.fecha_inicio;
      return new Date(string);
    }
  },
  getBlacklisted: function(status) {
    return Empresa.getBlacklisted(status)
      .then(function(companies) {
        console.log(companies.length+" companies found");
        var ids = companies.map(function(company) {
          return company.id
        });
        return Contrato.find({ provedorContratista: ids }).populate('provedorContratista');
      });
  }
};
