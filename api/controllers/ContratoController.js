/**
 * ContratoController
 *
 * @description :: Server-side logic for managing contratoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  sum : function(req,res){
    var params = req.params.all();
    var response = {error : 'at least one of dependencia2, provedorContratista or unidadCompradora must be defined'};
    delete params.id;
    delete params.limit;
    delete params.skip;
    delete params.sort;
    if(params.where){
      params.where = JSON.parse(params.where);
      if(params.where.dependencia2 || params.where.provedorContratista || params.where.unidadCompradora){

        if(!params.where.moneda) params.where.moneda = 'MXN';

        Contrato.find(params).sum('importe_contrato').exec(function(e,result){
          var sum = result.length ? result[0].importe_contrato : 0;
          response = {
            sum : sum,
            moneda : params.where.moneda
          };
          res.json(response);
        });
      }else{
        res.json(response);
      }
    }else{
      res.json(response);
    }


  },
};

