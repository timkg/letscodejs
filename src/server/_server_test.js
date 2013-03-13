"use strict";

var http, server, fs, assert;
server = require("./server.js");
http = require('http');
fs = require('fs');
assert = require('assert');

var TEST_DIR = 'generated/test';
var TEST_FILE = TEST_DIR + '/test.html';

exports.tearDown = function(done) {
	if( fs.existsSync(TEST_FILE) ) {
		fs.unlinkSync(TEST_FILE);
		assert.ok(!fs.existsSync(TEST_FILE), 'test file sould be deleted after test has run');
	}
	done();
};

exports.test_serverServesAFile = function(test) {
	var testFileContent = "Hello World, what a coincidence";

	fs.writeFileSync(TEST_FILE, testFileContent);

	server.start(TEST_FILE, 8080);
	var request = http.get('http://localhost:8080');
	request.on('response', function(response) {
		response.setEncoding('utf8');
		var responseData = '';
		test.equals(response.statusCode, 200, 'response statusCode is 200');
		response.on('data', function(chunk) {
			responseData += chunk;
		});
		response.on('end', function() {
			test.equals(responseData, testFileContent, 'correct response received from file');
			server.stop(function() {
				test.done();
			});
		});
	});
};

exports.test_serverThrowsExceptionWhenNoHtmlFilePassed = function(test) {
	test.throws(function() {
		server.start( null, 8008 );
	});
	test.done();
};

exports.test_serverThrowsExceptionWhenNoPortnumberPassed = function(test) {
	test.throws(function() {
		server.start(TEST_FILE);
	});
	test.done();
};

exports.test_serverRunsCallbackWhenStopCompletes = function(test) {
	server.start(TEST_FILE, 8080);
	server.stop(test.done); // nodeunit would fail if test.done() wasn't called
};


exports.test_stopCalledTwiceInARowThrowsException = function(test) {
	test.throws(function() {
		server.stop();
	});
	test.done();
};