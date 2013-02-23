"use strict";

var server = require('http').createServer();

exports.start = function() {
	server.on('request', function(request, response){
		console.log('request received');

		var body =	'<!doctype html> <html> <head> <meta charset="utf-8">' +
					' <title></title> </head> <body> hi</body> </html>';

		response.end(body);
	});

	server.listen(8080);

	console.log('server started');
};

exports.stop = function(callback) {
	server.close(callback);
};