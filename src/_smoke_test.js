// launch server the same way we would in production
// get a page
// confirm we got something

(function() {

	'use strict';

	var http = require('http');
	var fs = require('fs');
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
		httpGet('http://localhost:5000', function(response, responseData) {
			var gotHomepage = (responseData.indexOf(EXPECTED_HOMEPAGE_MARKER) !== -1);
			test.ok(gotHomepage, 'returns index.html');
			test.done();
		});
	};

	exports.test_canGet404Page = function(test) {
		httpGet('http://localhost:5000/fileDoesNotExist.html', function(response, responseData) {
			var got404Page = (responseData.indexOf(EXPECTED_404_MARKER) !== -1);
			test.ok(got404Page, 'returns 404.html');
			test.done();
		});
	};

	function runServer(callback) {
		var procfileCommand = parseProcFile();
		serverProcess = child_process.spawn(procfileCommand.command, procfileCommand.options);
		
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


	/**
	 * The Procfile holds the command that heroku uses to run our application.
	 * We want to run our application via the same command for our local tests.
	 * This way we test if the command works properly.
	 * In order to do so, we need to replace the $PORT variable required by Heroku
	 * with some specific portnumber used for our local tests.
	 */
	function parseProcFile() {
		var procfileParser = require('procfile');
		var file = fs.readFileSync('Procfile', 'utf8');
		var parsed = procfileParser.parse(file);
		// structure of "parsed" = {web: {command: 'command', options: ['opt1', '...']}}
		// procfiles can contain multiple entries, we only care for "web" for now
		var web = parsed.web;
		// now we want to replace $PORT with a concrete port number
		web.options = web.options.map(function(element) {
			if( element === '$PORT' ) {
				return '5000';
			} else {
				return element;
			}
		});
		return web;
	}

}());
