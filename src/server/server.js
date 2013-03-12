"use strict";

var server = require('http').createServer();

exports.start = function(portNumber) {
	if( !portNumber ) {
		throw new Error('server.start() requires port number');
	}

	server.on('request', function(request, response){
		response.statusCode = 200;
		response.end('Hello World');
	});
	server.listen(portNumber);
};

exports.stop = function(callback) {
	server.close(callback);
};