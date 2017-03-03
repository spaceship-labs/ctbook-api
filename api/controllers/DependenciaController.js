/**
 * DependenciaController
 *
 * @description :: Server-side logic for managing dependencias
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  favorites: function(req, res) {
    var id = req.allParams().id;
    if (id) {
      Dependencia.favorites(id).then(function(companies) {
        res.json(companies);
      });
    } else {
      res.json({ error: 'You must provide a Dependencia ID' })
    }
  },
  definitivos: function(req, res) {
    var id = req.allParams().id;
    if(id){
      Dependencia.blacklisted(id).then(function(companies){
        res.json(companies);
      })
    }else{
      res.json({error:'You must provide a Dependencia ID'})
    }

  }
};
