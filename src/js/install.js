/*
 * Copyright (c) 2014, University of California, Berkeley
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 */

// Author: Liang Gong (gongliang13@cs.berkeley.edu)

// Command Line Usage:
// node src/js/commands/run_test.js <jalangi_home> <program to be instrumented> <analysis code>
// Example:
// node src/js/commands/run_test.js ../jalangi ../jalangi/tests/octane/pdfjs.js src/js/analyses/jitaware/JITAware.js

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var child;
var cur_dir = process.cwd();
var path = require('path');
var jalangi_home_dir = path.resolve(process.cwd() + '/../' + 'jalangi');
var sys = require('sys');
var fs = require('fs');

// check if the parent directory has a sub-directory called jalangi
if (fs.existsSync('../jalangi')) {
	console.log('directory jalangi already exists in the parent directory, install abort.');
	return;
}

var mkdir_comm = 'mkdir ../jalangi';


exec(mkdir_comm, function(error, stdout, stderr) {
	if (error !== null) {
		console.log('creating directory error: ' + error);
	} else {
		download_jalangi_master_branch();
	}
});

function download_jalangi_master_branch() {
	console.log('\r\nStart downloading jalangi master branch...\r\nExecuting: git clone -b master https://github.com/SRA-SiliconValley/jalangi.git\r\nThis may take a while (10 min perhaps, depends on your network), please wait...');
	var download_comm = 'git clone -b master https://github.com/SRA-SiliconValley/jalangi.git'
	child = exec(download_comm, {
		cwd: jalangi_home_dir
	}, function(error, stdout, stderr) {
		if (error !== null) {
			console.log('download error: ' + error);
		} else {
			console.log('download complete');
			console.log('start installing jalangi...');
			movefiles();
		}
	});

	child.stdout.on('data', function(data) {
		sys.print(data);
	});
}

function movefiles() {
		var move_comm = 'mkdir jalangi2; mv jalangi/* ./jalangi2/; rmdir --ignore-fail-on-non-empty jalangi; mv jalangi2/* . ; rmdir --ignore-fail-on-non-empty jalangi2'
		child = exec(move_comm, {
			cwd: jalangi_home_dir
		}, function(error, stdout, stderr) {
			console.log('start installing jalangi');
			install_jalangi();
		});
	} //

function install_jalangi() {
	var install_comm = 'python ./scripts/install.py'
	child = exec(install_comm, {
		cwd: jalangi_home_dir
	}, function(error, stdout, stderr) {
		if (error !== null) {
			console.log('install error: ' + error);
		} else {
			console.log('install complete.')
			download_selenium();
		}
	});

	child.stdout.on('data', function(data) {
		sys.print(data);
	});
}

// download_selenium();

function download_selenium() {
	console.log('start downloading selenium...');
	fs.writeFileSync('thirdparty/selenium-server-standalone-2.41.0.jar', '');
	var child = spawn('curl', ['http://selenium-release.storage.googleapis.com/2.41/selenium-server-standalone-2.41.0.jar']);

	child.stdout.on('data', function(data) {
		fs.appendFileSync('thirdparty/selenium-server-standalone-2.41.0.jar', data);
	});

	
	child.on('close', function() {
		console.log('download complete.');
	});
}

function decompress() {
	exec('unzip chromedriver_mac32.zip; rm chromedriver_mac32.zip');
}