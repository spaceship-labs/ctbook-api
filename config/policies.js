/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {
   '*': false,
   'twitter' : true,
   'contrato' : {
      'find' : true,
      'findOne' : true,
      'count' : true,
      'sum' : true,
      'stats' : true
    },
    'dependencia' : {
      'find' : true,
      'findOne' : true,
      'favorites' : true,
      'blacklist' : true,
    },
    'unidadCompradora' : {
      'find' : true,
      'findOne' : true,
    },
    'empresa' : {
      'find' : true,
      'findOne' : true,
      'count' : true,
      'satblack' : true,
    }
};
