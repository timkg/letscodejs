(function() {
	/**/
	"use strict";

	var server, fs;
	server = require('http').createServer();
	fs = require('fs');

	exports.start = function(homepageToServe, notFoundPageToServe, portNumber, callback) {
		if( !homepageToServe ) {
			throw new Error('server.start() requires html file');
		}

		if( !notFoundPageToServe ) {
			throw new Error('server.start() requires 404 file');
		}

		if( !portNumber ) {
			throw new Error('server.start() requires port number');
		}

		server.on('request', function(request, response) {
			if( request.url === '/' || request.url === '/index.html') {
				response.statusCode = 200;
				serveFile(response, homepageToServe);
			} else {
				response.statusCode = 404;
				serveFile(response, notFoundPageToServe);
			}
		});
		server.listen(portNumber, callback);
	};

	exports.stop = function(callback) {
		server.close(callback);
	};

	function serveFile(response, file) {
		fs.readFile(file, function(err, data) {
			if (err) { throw err; }
			response.end(data);
		});
	}

}());