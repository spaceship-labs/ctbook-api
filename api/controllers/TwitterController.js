/**
 * TwitterController
 *
 * @description :: Server-side logic for managing twitters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    var q = req.param('q');

    var Twitter = require('twitter');

    var client = new Twitter({
      consumer_key: 'blL68dw9WRy2TWZHpiwzU5My5',
      consumer_secret: 'hv5LXT8kA9QErJc6mi3OeJ9avFkpp0BciAox3ztuFoShvChKup',
      access_token_key: '124797851-NAUiTiCttwq1d9JwH7IGQtNOU7ZGS1sp242L6PjD',
      access_token_secret: '1mTthSde7qeYhe2xv3SdJrswFYCQWeQIdB0OuIqiZRe9K'
    });

    client.get('search/tweets',{q:q,count:'40'}, function(error, tweets, response) {
      //if (error) throw error;
      res.json(tweets.statuses);
    });
    /*
    client.stream('statuses/filter', params, function(stream) {
      stream.on('data', function(tweet) {
        console.log(tweet.text);
      });

      stream.on('error', function(error) {
        throw error;
      });
    });*/
  }
};
