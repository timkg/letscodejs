"use strict";

var server, fs;
server = require('http').createServer();
fs = require('fs');


exports.start = function(htmlFileToServe, portNumber) {
	if( !htmlFileToServe ) {
		throw new Error('server.start() requires html file');
	}

	if( !portNumber ) {
		throw new Error('server.start() requires port number');
	}

	server.on('request', function(request, response) {
		fs.readFile(htmlFileToServe, function(err, data) {
			response.end(data);
		});
	});
	server.listen(portNumber);
};

exports.stop = function(callback) {
	server.close(callback);
};