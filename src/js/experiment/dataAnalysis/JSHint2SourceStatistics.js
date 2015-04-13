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

// this module is responsible for collecting source file information
function collectSourceFile(resultDB) {
	(function() {
		var fs = require('fs');
		var path = require('path');
		var stats = require('stats');
		var sourceIterator = require('../SourceFileIterator.js').module;
		var summary = {};
		var cwd = process.cwd();
		var Beautifier = require('node-js-beautify');
		var beautifier = new Beautifier(); // "awesome"
		var count = 0;
		var summaryFile = './exp/JSHint-Source-statistics.csv';
		summaryFile = path.resolve(cwd + '/' + summaryFile);

		sourceIterator.setBenchmarks(['websites']);
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
		function analyseFile(filename, fileLocation, website) {
			console.log(fileLocation);
			var statRes;
			var content = fs.readFileSync(fileLocation, 'utf8');

			//console.log('analyzing file (' + (++count) + '): ' + filename);
			//console.log('beautifying...');
			content = beautifier.beautify_js(content, {});
			//console.log('collecting file summary...');
			try {
				statRes = stats.parse(content);
				resultDB[website].numStatements += statRes.loc;
			} catch (ex) {
				console.log('error parsing the file.');
				console.log(ex);
				//console.log(content);
				//resultDB[website].numStatements += content.split('\n').length;
			}
		}

		function analyseFilePost(fileNum) {
			var url;
			var propList = ['numJSHintWarnings', 'numStatements'];
			console.log(JSON.stringify(resultDB, 0, 2));
			fs.writeFileSync(summaryFile, 'url,' + propList.join(',') + '\r\n');
			for (url in resultDB) {
				if (!(resultDB.hasOwnProperty(url))) continue;
				var line = url;
				for (var i = 0; i < propList.length; i++) {
					line = line + ',' + resultDB[url][propList[i]];
				}
				fs.appendFileSync(summaryFile, line + '\r\n');
			}
			console.log('Result written into:\r\n\t' + summaryFile);
		}
	})();
}

/*
	Go over all JSHint warnings and collect information on:
	1. the number of JSHint warnings
	2. the number of statements in beautified JavaScript code
*/
(function() {
	var Beautifier = require('node-js-beautify');
	var beautifier = new Beautifier(); // "awesome"
	var stats = require('stats');
	var expConfig = require('../ExpConfig.js').module;

	var fs = require('fs');
	var path = require('path');
	var dataIterator = require('../iterator.js').iterator;
	var cwd = process.cwd();
	var dataBaseDir = process.cwd();
	var resultDB = {};

	dataIterator.setBenchmarks(['websites']);
	dataIterator.setDataDir(dataBaseDir);
	// iterate through all JSHint results
	dataIterator.iterate_JSHint_Result_in_JSON(statistics, statisticsPost);

	/* jshint warning sample:
	  {
	    "benchmark": "rankedsites",
	    "filename": "www.cafepress.com_",
	    "srcFile": "eval_code4.js",
	    "type": "Missing semicolon.",
	    "scope": "(main)",
	    "code": "W033",
	    "details": "Missing semicolon.",
	    "line": 1,
	    "column": 188
	  },
	*/
	function statistics(benchmark, website, srcFilename, srcFileLocation) {
		console.log('processing: ' + benchmark + '-' + website);
		var warningCnt = 0,
			sourceFile;
		var srcDB = {},
			srcContent, statRes;
		var statCnt = 0;

		var content = fs.readFileSync(srcFileLocation, 'utf8');
		var idx, db = JSON.parse(content);
		for (idx = 0; idx < db.length; idx++) {
			if (!expConfig.shouldRemove2(db[idx].code)) {
				warningCnt++;
			}
		}

		if (!resultDB[website]) {
			resultDB[website] = {};
		}
		resultDB[website].numJSHintWarnings = warningCnt;
		resultDB[website].numStatements = statCnt;
	}

	/*
		structure of resultDB:
		resultDB[website].numJSHintWarnings = warningCnt;
		resultDB[website].numStatements = statCnt;
	*/
	function statisticsPost() {
		collectSourceFile(resultDB);
	}


})();
