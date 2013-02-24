"use strict";

var http, server;
server = require("./server.js");
http = require('http');

exports.tearDown = function(done) {
	// we want our test to call server.stop() after all tests are finished.
	// we need to call done() in order for the test to work. If we don't call done(),
	// nodeunit can't verify that everything finished as expected.
	// server.stop() is asynchronous, so we can't just call done() after calling server.stop(),
	// because the proper order is not guaranteed. So we pass a reference to done as callback
	// to server.stop(), which executes any callback parameters it encounters.
	server.stop(done);
};

exports.test_serverReturnsHelloWorld = function(test) {
	// test.expect(1);
	server.start();
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
			test.done();
		});
	});
};