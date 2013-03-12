"use strict";

var http, server;
server = require("./server.js");
http = require('http');

exports.test_serverReturnsHelloWorld = function(test) {
	server.start(8080);
	var request = http.get('http://localhost:8080');
	request.on('response', function(response) {
		response.setEncoding('utf8');
		var responseData = '';
		test.equals(response.statusCode, 200, 'response statusCode is 200');
		response.on('data', function(chunk) {
			responseData += chunk;
		});
		response.on('end', function() {
			test.equals(responseData, 'Hello World', 'response equals Hello World');
			server.stop(test.done);
		});
	});
};

exports.test_serverServesAFile = function(test) {
	test.done();
};

exports.test_serverThrowsExceptionWhenNoPortnumberPassed = function(test) {
	test.throws(function() {
		server.start();
	});
	test.done();
};

exports.test_serverRunsCallbackWhenStopCompletes = function(test) {
	server.start(8080);
	server.stop(test.done); // nodeunit would fail if test.done() wasn't called
};


exports.test_stopCalledTwiceInARowThrowsException = function(test) {
	test.throws(function() {
		server.stop();
	});
	test.done();
};