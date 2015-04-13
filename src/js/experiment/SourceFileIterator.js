/*
 * Copyright (c) 2015, University of California, Berkeley
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



// Author: Liang Gong (gongliang13@cs.berkeley.edu)
/*
 1. scan the root directory and identify all JavaScript files to call a call back function
*/

// this is the script that scans over the root directory and identify all original JavaScript files.


(function() {
	var fs = require('fs');
	var benchmarks = ['websites'];
	var rawDataDir = '/Users/jacksongl/Box Sync';
	var ignoreSrcFileSuffix = ['_jalangi_sourcemap.js', '_jalangi_.js', '.jsonLike', '.json'];
	var numFiles, totalNumFiles;

	// this is the main function
	function mainRun() {
		scan(rawDataDir);
	}

	// function to be overriden
	function analyseFile(filename, fileLocation, website) {

	}

	// function to be overriden
	function analyseFilePost(totalFileNum) {

	}


	// scan the dataDir and identify all files
	// to be processed. 
	function scan(dataDir) {
		numFiles = 0;
		// gather all analysisResults.json files
		// and store the result into analysisDB
		outter: for (var i = 0; i < benchmarks.length; i++) {
			var dir = dataDir + '/' + benchmarks[i];
			if (!fs.existsSync(dir)) {
				console.log(' **** [warning]: dir ' + dir + ' does not exist *** ');
				continue outter;
			}
			var files = fs.readdirSync(dir);
			inner: for (var j in files) {
				if (!files.hasOwnProperty(j)) continue inner;
				var subdir = files[j];
				// if the subdir is not a directory, continue
				if (!fs.lstatSync(dir + '/' + subdir).isDirectory()) continue inner;
				// if there is no src subdirectory in subdir, continue
				if (!fs.lstatSync(dir + '/' + subdir + '/src').isDirectory()) continue inner;
				var srcDir = dir + '/' + subdir + '/src';
				var srcFiles = fs.readdirSync(srcDir);
				inner2: for (var srcIndex in srcFiles) {
					if (!srcFiles.hasOwnProperty(srcIndex)) continue inner2;
					var srcFile = srcFiles[srcIndex];
					// if the file should be ignored, continue
					if (ignoreSrcFile(srcFile)) continue inner2;
					numFiles++;
					//console.log(srcDir + '/' + srcFile);
					analyseFile(srcFile, srcDir + '/' + srcFile, subdir);
				}
			}
		}
		analyseFilePost(numFiles);
		console.log('Iterate through ' + numFiles + ' JavaScript source files.');
		totalNumFiles = numFiles;
	}

	function ignoreSrcFile(srcFile) {
		// filter useless files
		var skip = false;
		ignoreSrcFileSuffix.forEach(function(value) {
			if (skip) return;
			if (srcFile.indexOf(value) >= 0) {
				skip = true;
			}
		});
		return skip;
	}

	var module = {};
	exports.module = module;

	module.setBenchmarks = function (array) {
		benchmarks = array;
	}

	module.setDataBaseDir = function (dir) {
		rawDataDir = dir;
	}

	module.setAnalyseFileCallback = function (callback) {
		analyseFile = callback;
	}

	module.setAnalyseFileCallbackPost = function (callback) {
		analyseFilePost = callback;
	}

	module.run = mainRun;

})();