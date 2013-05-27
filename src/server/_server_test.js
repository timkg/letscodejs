(function() {
	/**/
	"use strict";

	var http, server, fs, assert;
	server = require("./server.js");
	http = require('http');
	fs = require('fs');
	assert = require('assert');

	var TEST_DIR = 'generated/test';
	var TEST_HOMEPAGE = TEST_DIR + '/test.html';
	var TEST_404_FILE = TEST_DIR + '/test404.html';

	var PORT = 8080;
	var BASE_URL = 'http://localhost:' + PORT;

	exports.tearDown = function(done) {
		cleanUpFile(TEST_HOMEPAGE);
		cleanUpFile(TEST_404_FILE);
		done();
	};

	exports.test_servesHomepageFromFile = function(test) {
		var expectedData = "Hello World, what a coincidence";
		fs.writeFileSync(TEST_HOMEPAGE, expectedData);

		httpGet(BASE_URL, function(response, responseData) {
			test.equals(response.statusCode, 200, 'response statusCode is 200');
			test.equals(responseData, expectedData, 'correct response received from file');
			test.done();
		});
	};

	exports.test_returnsHomepageWhenAskedForIndex = function(test) {
		var expectedData = "Hello World, what a coincidence";
		fs.writeFileSync(TEST_HOMEPAGE, expectedData);

		httpGet(BASE_URL + '/index.html', function(response, responseData) {
			test.equals(response.statusCode, 200, 'response statusCode is 200');
			test.equals(responseData, expectedData, 'correct response received from file');
			test.done();
		});
	};

	exports.test_throwsExceptionWhenNoHtmlFilePassed = function(test) {
		test.throws(function() {
			server.start( null, TEST_404_FILE, 8008 );
		});
		test.done();
	};


	exports.test_throwsExceptionWhenNo404FilePassed = function(test) {
		test.throws(function() {
			server.start( TEST_HOMEPAGE, null, 8008 );
		});
		test.done();
	};

	exports.test_throwsExceptionWhenNoPortnumberPassed = function(test) {
		test.throws(function() {
			server.start( TEST_HOMEPAGE, TEST_404_FILE );
		});
		test.done();
	};

	exports.test_returns404FromFileForEverythingButHomepage = function(test) {
		var expectedData = "404 not found";
		fs.writeFileSync(TEST_404_FILE, expectedData);

		httpGet(BASE_URL + '/garblegarble', function(response, responseData) {
			test.equals(response.statusCode, 404, 'response statusCode is 404');
			test.equals(responseData, expectedData, 'returns custom 404 file');
			test.done();
		});
	};

	exports.test_runsCallbackWhenStopCompletes = function(test) {
		server.start(TEST_HOMEPAGE, TEST_404_FILE, 8080);
		server.stop(test.done);
	};

	exports.test_stopThrowsExceptionWhenNotRunning = function(test) {
		test.throws(function() {
			server.stop();
		});
		test.done();
	};

	function httpGet(url, callback) {
		server.start(TEST_HOMEPAGE, TEST_404_FILE, 8080, function() {
			var request = http.get(url);
			request.on('response', function(response) {
				var responseData = '';
				response.setEncoding('utf8');

				response.on('data', function(chunk) {
					responseData += chunk;
				});

				response.on('end', function() {
					server.stop(function() {
						callback(response, responseData);
					});
				});
			});
		});
		
	}

	function cleanUpFile(fileName) {
		if( fs.existsSync(fileName) ) {
			fs.unlinkSync(fileName);
			assert.ok(!fs.existsSync(fileName), 'test file sould be deleted after test has run');
		}
	}
}());