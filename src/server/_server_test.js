"use strict";

var http, server;
server = require("./server.js");
http = require('http');

exports.testServerRespondsToGetRequests = function(test) {
	test.expect(1);
	server.start();
	http.get('http://localhost:8080', function(response) {
		test.ok(response, 'GET http://localhost:8080 yielded a response');
		test.done();
	});
};

exports.tearDown = function(done) {
	// we want our test to call server.stop().
	// we need want to call done() in order for the test to work. If we don't call done(),
	// nodeunit can't verify that everything finished as expected.
	// server.stop() is asynchronous, so we can't just call done() after calling server.stop(),
	// because the proper order is not guaranteed. So we pass a reference to done as callback
	// to server.stop(), which executes any callback parameters it encounters.
	server.stop(done);
};