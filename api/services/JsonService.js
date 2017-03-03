/**
 * JsonService.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var q = require('q');

module.exports = {
  //Returns a JSON object from remote file.
  load: function(url) {
    console.log(url);
    var deferred = q.defer();
    var request = require('request');
    request.get(url, function(e, res, body) {
      var data = JSON.parse(body);
      deferred.resolve(data);
    });

    return deferred.promise;
  },
  //Saves an object to a filename
  save: function(object,filename) {
    var fs = require('fs');
    var string = JSON.stringify(object);
    return fs.writeFile(filename, string);
  }

}
  