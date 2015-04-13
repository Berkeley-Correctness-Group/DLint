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
	This module is written to collect source code information
	of websites in experimental dataset
*/

(function() {
	var fs = require('fs');
	var path = require('path');
	var stats = require('stats');
	var expConfig = require('../ExpConfig.js').module;
	var sourceIterator = require('../SourceFileIterator.js').module;
	var summary = {};
	var cwd = process.cwd();
	var Beautifier = require('node-js-beautify');
	var beautifier = new Beautifier(); // "awesome"
	var count = 0;
	var summaryFile = './exp/Source-statistics.csv';
	summaryFile = path.resolve(cwd + '/' + summaryFile);

	sourceIterator.setDataBaseDir(process.cwd());
	sourceIterator.setAnalyseFileCallback(analyseFile);
	sourceIterator.setAnalyseFileCallbackPost(analyseFilePost);
	// iterate through all source results
	sourceIterator.run();

	/**
	stats parse sample output:
	{ 
	  loc: 65,
	  bytes: 1112,
	  statements: 16,
	  assignments: 9,
	  functions: 3,
	  stringBytes: 20,
	  arrayLiterals: 0,
	  objectLiterals: 1,
	  objectsCreated: 1,
	  strings: 4,
	  numbers: 9,
	  throws: 1 
	}
	*/
	function analyseFile(filename, fileLocation) {
		var statRes;
		var content = fs.readFileSync(fileLocation, 'utf8');

		console.log('analyzing file (' + (++count) + '): ' + filename);
		console.log('beautifying...');
		content = beautifier.beautify_js(content, {});
		console.log('collecting file summary...');
		try {
			statRes = stats.parse(content);
			summary = merge(summary, statRes);
		} catch (ex) {
			console.log('error parsing the file, skipped.');
		}
	}

	// sum all properties with a number values in two objects
	function merge(obj1, obj2) {
		var res = {},
			prop;
		for (prop in obj1) {
			if (!(obj1.hasOwnProperty(prop))) continue;
			res[prop] = (res[prop] | 0) + (obj1[prop] | 0);
		}

		for (prop in obj2) {
			if (!(obj2.hasOwnProperty(prop))) continue;
			res[prop] = (res[prop] | 0) + (obj2[prop] | 0);
		}
		return res;
	}

	function analyseFilePost(fileNum) {
		var prop;
		console.log(JSON.stringify(summary, 0, 2));
		fs.writeFileSync(summaryFile, '');
		for (prop in summary) {
			if (!(summary.hasOwnProperty(prop))) continue;
			fs.appendFileSync(summaryFile, prop + ',' + summary[prop] + '\r\n');
		}
		console.log('Result written into:\r\n\t' + summaryFile);
	}
})();