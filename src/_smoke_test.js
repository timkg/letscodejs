// launch server the same way we would in production
// get a page
// confirm we got something

(function() {

	'use strict';

	var child_process = require('child_process');
	var http = require('http');

	exports.test_smoke_test = function(test) {
		var process = runServer(['src/server/weewikipaint', '8080']);
		setTimeout(function() {
			httpGet('http://localhost:8080', function() {
				console.log('got file');
				process.kill();
				test.done();
			});
		}, 1000);
	};


	function runServer(nodeArgs) {
		var process = child_process.spawn("node", nodeArgs);
		
		process.stdout.on('data', function(chunk) {
			console.log("stdout logged " + chunk);
		});

		process.stderr.on('data', function(chunk) {
			console.log("stderr logged " + chunk);
		});

		process.on('exit', function(code, signal) {
			console.log("exited with code " + code + " and signal " + signal);
		});

		return process;
	}

	function killServer() {

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
