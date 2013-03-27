// launch server the same way we would in production
// get a page
// confirm we got something

(function() {

	'use strict';

	var http = require('http');
	var child_process = require('child_process');
	var serverProcess; // outer scope needed for tearDown()
	
	var EXPECTED_HOMEPAGE_CONTENT = 'hello world';


	exports.setUp = function(done) {
		runServer(done);
	};


	exports.tearDown = function(done) {
		serverProcess.on('exit', function() {
			done();
		});

		serverProcess.kill();
	};

	exports.test_canGetHomepage = function(test) {
		httpGet('http://localhost:8080', function(response, responseData) {
			test.equals(response.statusCode, 200, 'response statusCode is 200');
			test.equals(responseData, EXPECTED_HOMEPAGE_CONTENT, 'returns index.html');
			test.done();
		});
	};


	// TODO - check for 404 page


	function runServer(callback) {
		serverProcess = child_process.spawn("node", ['src/server/weewikipaint', '8080']);
		
		serverProcess.stdout.setEncoding('utf8');

		serverProcess.stdout.on('data', function(chunk) {
			console.log("stdout logged " + chunk);
			if( chunk.trim() === 'Server started' ) {
				callback();
			}
		});

		serverProcess.stderr.on('data', function(chunk) {
			console.log("stderr logged " + chunk);
		});
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
