"use strict";

var server = require('http').createServer();
var fs = require("fs");

server.on('request', function(request, response){
	console.log('request received');

	fs.readFile('file.html', function(err, data) {
		response.end(data);
	});
});

server.listen(8080);

console.log('server started on port 8080');