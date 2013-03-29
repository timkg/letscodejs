(function() {

	'use strict';

	var http = require('http');
	
	var EXPECTED_HOMEPAGE_MARKER = 'WeeWikiPaint homepage';
	var HOMEPAGE_URL = 'http://mighty-earth-5067.herokuapp.com/';

	exports.test_appIsOnline = function(test) {
		httpGet(HOMEPAGE_URL, function(response, responseData) {
			var gotHomepage = (responseData.indexOf(EXPECTED_HOMEPAGE_MARKER) !== -1);
			test.ok(gotHomepage, 'app is online');
			test.done();
		});
	};


	// todo - remove duplication
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
