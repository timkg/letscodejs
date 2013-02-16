(function() {
	/*global desc, task, jake, fail, complete*/
	"use strict";

	task('default', ['lint']);

	desc('Lint everything');
	task('lint', [], function() {
		var lint = require('./build/lint/lint_runner.js');
		var files = new jake.FileList();
		files.include('**/*.js');
		var options = nodeLintOptions();
		lint.validateFileList(files.toArray(), nodeLintOptions(), {});
	});

	function nodeLintOptions() {
		return {
			bitwise:true,
			curly:true,
			eqeqeq:true,
			forin:true,
			immed:true,
			latedef:true,
			newcap:true,
			noarg:true,
			noempty:true,
			nonew:true,
			regexp:true,
			undef:true,
//			unused: true,
			strict:true,
			trailing:true,
			node:true
		};
	}
}());