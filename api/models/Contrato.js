/**
* Contrato.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    dependencia2 : {
      model : 'dependencia',
      index : true,
    },
    unidadCompradora : {
      model : 'unidadCompradora',
      index : true,
    },
    provedorContratista : {
      model : 'empresa',
      index : true,
    },
    importe_contrato : {
      index : true,
      type : 'float'
    }
  }
};

