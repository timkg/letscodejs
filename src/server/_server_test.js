"use strict";

var server = require("./server.js");

exports.testNothing = function(test) {
	test.equals(4, server.number(), 'server.number() returns number 3');
	test.done();
};