(function() {
	"use strict";

	var server = require('./server.js');
	
	server.start('../../index.html', '../../404.html', process.argv[2]);

}());