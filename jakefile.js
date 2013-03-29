(function() {
	/*global desc, task, jake, fail, complete, directory */
	"use strict";

	var GENERATED_DIR = 'generated';
	var TEMP_TESTFILE_DIR = GENERATED_DIR + '/test';


	directory(TEMP_TESTFILE_DIR);


	desc('Delete all generated temporary files');
	task('clean', [], function() {
		jake.rmRf(GENERATED_DIR);
	});

	desc('Build and test');
	task('default', ['lint', 'test']);


	desc('Lint everything');
	task('lint', [], function() {
		console.log('LINT start');
		var lint = require('./build/lint/lint_runner.js');
		var files = new jake.FileList();
		files.include('**/*.js');
		files.exclude('node_modules');
		files.exclude('karma.conf.js');

		var passed = lint.validateFileList(files.toArray(), nodeLintOptions(), {});
		if (!passed) {
			fail('lint failed');
		}
		console.log('LINT done');
	});


	desc('Test everything');
	task('test', ['testClient', 'testServer'], function() {
		
	});


	desc('Server tests');
	task('testServer', [TEMP_TESTFILE_DIR], function() {
		console.log('\n\nSERVER TESTS');
		var files = new jake.FileList();
		files.include('**/_*_test.js');
		files.exclude('node_modules');
		files.exclude('client');

		var reporter = require('nodeunit').reporters['default'];
		reporter.run(files.toArray(), null, function(failures) {
			if (failures) {
				fail('tests failed'); // tell jake to abort build when there are failures
			}
			complete(); // tell jake that this async task is complete
		});
	}, {async: true}); // tell jake to wait for an async task that signalizes it's done with a call to complete()


	desc('Client tests');
	task('testClient', [], function() {
		console.log('\n\nCLIENT TESTS');
		sh('node node_modules/.bin/karma run', complete);
	}, {async: true});

	
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


	function sh(command, callback) {
		var stdout = "";
		var process = jake.createExec(command, {printStdout: true, printStderr: true});
		process.on('stdout', function(chunk) {
			stdout += chunk;
		});
		process.on('error', function(msg, code) {
			fail(msg);
		});
		process.on('cmdEnd', function() {
			callback(stdout);
		});
		process.run();
	}


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