const request = require('request');
const config = require('./config.json');

module.exports = function (app){
	'use strict';

	app.get('/', function (req, res) {
	    res.render('index.html');
  	});

	app.get('/api', function(req,res){
	var search = req.query.Query;
	request(config.search_url + search +'?access_token=' + config.access_token, 
		function (error, response, body) {
		  	if (!error && response.statusCode == 200) {
		  		console.log(body.length + " objects returned");
		    	res.send(body);
		      }
		      else
		      {
		      	res.send(error);
		      }
		});
	});

};