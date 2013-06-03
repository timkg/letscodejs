(function() {
	/*global desc, task, jake, fail, complete, directory, console */
	"use strict";

	var lint = require('./build/lint/lint_runner.js');
	var nodeunit = require('nodeunit').reporters['default'];

	var GENERATED_DIR = 'generated';
	var TEMP_TESTFILE_DIR = GENERATED_DIR + '/test';

	directory(TEMP_TESTFILE_DIR);

	desc('Delete all generated temporary files');
	task('clean', [], function() {
		jake.rmRf(GENERATED_DIR);
	});

	desc('Build and test');
	task('default', ['lint', 'test'], function() {
		console.log('\n\n OK');
	});

	desc('Lint everything');
	task('lint', ['lintClient', 'lintServer']);

	desc('Lint Server code');
	task('lintServer', [], function() {
		var passed = lint.validateFileList(serverLintFiles(), nodeLintOptions(), {});
		if (!passed) { fail('lint server failed'); }
	});

	desc('Lint Client code');
	task('lintClient', [], function() {
		var passed = lint.validateFileList(clientLintFiles(), browserLintOptions(), {});
		if (!passed) { fail('lint client failed'); }
	});

	desc('Test everything');
	task('test', ['testClient', 'testServer']);

	desc('Server tests');
	task('testServer', [TEMP_TESTFILE_DIR], function() {
		console.log('\n\nSERVER TESTS');
		nodeunit.run(serverTestFiles().toArray(), null, function(failures) {
			if (failures) { fail('tests failed'); }
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

	function clientLintFiles() {
		var files = new jake.FileList();
		files.include('src/client/**/*.js');
		return files.toArray();
	}

	function serverLintFiles() {
		var files = new jake.FileList();
		files.include('**/*.js');
		files.exclude('node_modules');
		files.exclude('karma.conf.js');
		files.exclude('src/client');
		files.exclude('client_vendors');
		files.exclude('vendor_client/**/*.js');
		return files.toArray();
	}

	function nodeLintOptions() {
		var options = lintOptions();
		options.node = true;
		return options;
	}

	function browserLintOptions() {
		var options = lintOptions();
		options.browser = true;
		return options;
	}

	function lintOptions() {
		return {
			bitwise:true,
			curly:true,
			eqeqeq:true,
			forin:true,
			immed:true,
			latedef:true,
			laxcomma: true,
			newcap:true,
			noarg:true,
			noempty:true,
			nonew:true,
			regexp:true,
			undef:true,
			strict:true,
			trailing:true
		};
	}


	function serverTestFiles() {
		var files = new jake.FileList();
		files.include('**/_*_test.js');
		files.exclude('node_modules');
		files.exclude('client');
		return files;
	}



}());