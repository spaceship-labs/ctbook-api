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
  blacklist: function(req, res) {
    var id = req.allParams().id;
    var status = req.allParams().status;
    if(id && status){
      Dependencia.blacklisted(id,status).then(function(companies){
        res.json(companies);
      });
    }else{
      res.json({error:'You must provide a Dependencia ID and a Status'})
    }

  }
};
