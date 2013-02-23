(function() {
	/*global desc, task, jake, fail, complete*/
	"use strict";


	desc('Build and test');
	task('default', ['lint', 'test']);


	desc('Lint everything');
	task('lint', [], function() {
		var lint = require('./build/lint/lint_runner.js');
		var files = new jake.FileList();
		files.include('**/*.js');
		var options = nodeLintOptions();
		var passed = lint.validateFileList(files.toArray(), nodeLintOptions(), {});
		if (!passed) {
			fail('lint failed');
		}
	});


	desc('Test everything');
	task('test', [], function() {
		var reporter = require('nodeunit').reporters['default'];
		reporter.run(['src/server/_server_test.js'], null, function(failures) {
			if (failures) {
				fail('tests failed'); // tell jake to abort build when there are failures
			}
			complete(); // tell jake that async task is complete
		});
	}, {async: true});	// tell jake to wait for an async task
						//that signalizes it's done with a call to complete()

	
	desc('Integration');
	task('integrate', ['default'], function() {
		console.log("1. Make sure 'git status' is clean");
		console.log("2. Build on the integration box");
		console.log("	a. walk over to integration box");
		console.log("	b. 'git pull'");
		console.log("	c. 'jake'");
		console.log("3. 'git checkout integration'");
		console.log("4. 'git merge master --no-ff --log'");
		console.log("5. 'git checkout master'");
		
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