/* ScraperService.js *
 * @description::
 * @docs::http: //sailsjs.org/#!documentation/controllers
 */

var fs = require('fs'),
  q = require('q'),
  service = module.exports = {};

service.wget = wget;
service.request = request;

function wget(url, dir) {
  var deferred = q.defer(),
    fname = url.split('/');
  fname = fname[fname.length - 1];
  if (fs.existsSync(dir + fname)) {
    console.log('already downloaded ' + fname);
    deferred.resolve(dir + fname);
  } else {
    console.log('downloading ' + url);
    var util = require('util'),
      exec = require('child_process').exec,
      child,
      child = exec('wget -O ' + dir + fname + ' ' + url,
        function(error, stdout, stderr) {
          // console.log('stdout: ' + stdout);
          // console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
            deferred.reject(error);
          }
        });
    child.on('exit', function() {
      console.log('downloaded: ' + fname);
      deferred.resolve(dir + fname);
    });
  }
  return deferred.promise;
}


function request(url, cb) {
  var fname = url.split('/');
  fname = fname[fname.length - 1];
  if (fs.existsSync(dir + fname)) {
    console.log('exists: ' + counter++);
    cb(null, fname);
  } else {
    var options = {
      uri: url,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20120427 Firefox/15.0a1'
      },
      method: "HTTP",
    }
    console.log('downloading: ' + url);
    var req = request(options).pipe(fs.createWriteStream(dir + fname)).on('finish', function(e, res, body) {
      if (e) cb(e, fname);
      console.log('downloaded :' + counter++);
      cb(null, fname);
    });
  }
}
