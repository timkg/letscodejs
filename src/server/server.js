"use strict";

var server = require('http').createServer();

exports.start = function(portNumber) {
	server.on('request', function(request, response){
		response.statusCode = 200;
		response.end('Hello World');
	});

	server.listen(portNumber);

	console.log('server started');
};

exports.stop = function(callback) {
	server.close(callback);
};