// launch server the same way we would in production
// get a page
// confirm we got something

(function() {

	'use strict';

	var http = require('http');
	var child_process = require('child_process');
	var serverProcess; // outer scope needed for tearDown()
	
	var EXPECTED_HOMEPAGE_MARKER = 'WeeWikiPaint homepage';
	var EXPECTED_404_MARKER = 'WeeWikiPaint 404 page';


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
			var gotHomepage = (responseData.indexOf(EXPECTED_HOMEPAGE_MARKER) !== -1);
			test.ok(gotHomepage, 'returns index.html');
			test.done();
		});
	};

	exports.test_canGet404Page = function(test) {
		httpGet('http://localhost:8080/fileDoesNotExist.html', function(response, responseData) {
			var got404Page = (responseData.indexOf(EXPECTED_404_MARKER) !== -1);
			test.ok(got404Page, 'returns 404.html');
			test.done();
		});
	};

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
