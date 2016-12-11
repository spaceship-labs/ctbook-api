/**
 * EmpresaController
 *
 * @description :: Server-side logic for managing empresas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	satblack : function(req,res){
		SatService.find(function(matches){
			res.json(matches);
		});
	}
};

