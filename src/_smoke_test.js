// launch server the same way we would in production
// get a page
// confirm we got something

(function() {

	'use strict';

	var http = require('http');
	var child_process = require('child_process');
	var serverProcess; // outer scope needed for tearDown()
	
	var EXPECTED_HOMEPAGE_CONTENT = 'hello world';

	exports.tearDown = function(done) {
		serverProcess.on('exit', function() {
			done();
		});

		serverProcess.kill();
	};

	exports.test_smoke_test = function(test) {
		serverProcess = runServer(['src/server/weewikipaint', '8080'], function() {
			httpGet('http://localhost:8080', function(response, responseData) {
				test.equals(response.statusCode, 200, 'response statusCode is 200');
				test.equals(responseData, EXPECTED_HOMEPAGE_CONTENT, 'returns index.html');
				test.done();
			});
		});	
	};


	// TODO - check for 404 page


	function runServer(nodeArgs, callback) {
		var process = child_process.spawn("node", nodeArgs);
		
		process.stdout.setEncoding('utf8');

		process.stdout.on('data', function(chunk) {
			console.log("stdout logged " + chunk);
			if( chunk.trim() === 'Server started' ) {
				callback();
			}
		});

		process.stderr.on('data', function(chunk) {
			console.log("stderr logged " + chunk);
		});

		return process;
	}


	// todo - remove duplication with _server_test.js
	function httpGet(url, callback) {
		var request = http.get(url);
		request.on('response', function(response) {
			var responseData = '';
			response.setEncoding('utf8');

			response.on('data', function(chunk) {
				responseData += chunk;
			});

			response.on('end', function() {
				callback(response, responseData);
			});
		});
	}

}());
