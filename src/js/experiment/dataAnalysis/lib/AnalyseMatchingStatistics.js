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
	This module is written to analyze the matched warning dataset

	So before using this module, make sure the following command is executed:
	```
	node src/js/experiment/Experiment1.js 
	```

	It will also scan all analysisResults.json and JSHintResults.json
	in the raw dataset to find all JSHint and DLintWarnings
*/

(function() {
	var cwd = process.cwd();
	var fs = require('fs');
	var path = require('path');
	var matchingJSONFile = path.resolve(cwd + '/' + 'exp/JSHint-DLint-matching.json');
	var matchingResult = fs.readFileSync(matchingJSONFile, 'utf8');
	var locationBase = '\\/Users\\/jacksongl\\/macos-workspace\\/research\\/jalangi\\/github_dlint\\/gitprojects\\/jalangi-dlint\\/instrumentFF_tmp\\/';
	var locationStrRegexp = new RegExp('\\(' + locationBase + '([^:]+):(\\d+):(\\d+):(\\d+):(\\d+)\\)', 'g');

	var expConfig = require('../../ExpConfig.js').module;
	var dataIterator = require('../../iterator.js').iterator;
	var JSHintDB = require('../../JSHintDB.js').JSHintDB;

	matchingResult = JSON.parse(matchingResult);
	console.log('Total Matchings: ' + matchingResult.length);

	var jsHintWarningDB = {};
	var dLintWarningDB = {};

	// construct query data structure
	var queryDB = {};
	for (var i = 0; i < matchingResult.length; i++) {
		var jshint = matchingResult[i].jshint;
		var dlint = matchingResult[i].dlint;

		var benchmark = jshint.benchmark;
		var filename = jshint.filename;
		var srcFile = jshint.srcFile;
		var line = jshint.line;
		var column = jshint.column;

		var tmp = queryDB;
		if (!tmp[benchmark]) {
			tmp[benchmark] = {};
		}
		tmp = tmp[benchmark];

		if (!tmp[filename]) {
			tmp[filename] = {};
		}
		tmp = tmp[filename];

		if (!tmp[srcFile]) {
			tmp[srcFile] = {};
		}
		tmp = tmp[srcFile];

		if (!tmp[line + ":" + column]) {
			tmp[line + ":" + column] = [];
		}

		tmp[line + ":" + column].push(jshint);

		var dlintLocationString = analyseDlintLocationString(dlint.locationString);
		line = dlintLocationString.line;
		column = dlintLocationString.column;

		if (!tmp[line + ":" + column]) {
			tmp[line + ":" + column] = [];
		}

		tmp[line + ":" + column].push(dlint);
	}

	function statistics(benchmark, website, jshint_jsonFile, jshint_jsonFileLocation, dlint_jsonFile, dlint_jsonFileLocation) {
		var jshintContent = fs.readFileSync(jshint_jsonFileLocation, 'utf8');
		var dlintContent = fs.readFileSync(dlint_jsonFileLocation, 'utf8');
		var jshintDB = JSON.parse(jshintContent);
		var dlintDB = JSON.parse(dlintContent);
		var i, j, k, tmp, warnings, matched, warningstr, curWarning;

		console.log(benchmark + '-' + website);
		// go through all jshint warnings
		for (i = 0; i < jshintDB.length; i++) {
			tmp = queryDB;
			if (!tmp[jshintDB[i].benchmark]) {
				mismatchJSHintWarning(jshintDB[i], benchmark, website, jshint_jsonFileLocation);
				continue;
			}
			tmp = tmp[jshintDB[i].benchmark];
			if (!tmp[jshintDB[i].filename]) {
				mismatchJSHintWarning(jshintDB[i], benchmark, website, jshint_jsonFileLocation);
				continue;
			}
			tmp = tmp[jshintDB[i].filename];
			if (!tmp[jshintDB[i].srcFile]) {
				mismatchJSHintWarning(jshintDB[i], benchmark, website, jshint_jsonFileLocation);
				continue;
			}
			tmp = tmp[jshintDB[i].srcFile];
			if (!tmp[jshintDB[i].line + ':' + jshintDB[i].column]) {
				mismatchJSHintWarning(jshintDB[i], benchmark, website, jshint_jsonFileLocation);
				continue;
			}
			warnings = tmp[jshintDB[i].line + ':' + jshintDB[i].column];
			curWarning = JSON.stringify(jshintDB[i]);

			matched = false;
			loop2: for (j = 0; j < warnings.length; j++) {
				warningstr = JSON.stringify(warnings[j]);
				if (warningstr === curWarning) {
					matchJSHintWarning(jshintDB[i], benchmark, 
						website, jshint_jsonFileLocation, dlint_jsonFileLocation);
					matched = true;
					break loop2;
				}
			}
			if (matched === false) {
				mismatchJSHintWarning(jshintDB[i], benchmark, website, jshint_jsonFileLocation);
			}
		}

		// go through all dlint urls
		for (i = 0; i < dlintDB.length; i++) {
			var filename = website;
			//console.log(filename);

			// go through all warnings in that url 
			dlintLoop2: for (k = 0; k < dlintDB[i].value.length; k++) {
				var dlintWarning = dlintDB[i].value[k];

				var dlintLocationString = analyseDlintLocationString(dlintWarning.locationString);
				if(!dlintLocationString)
					continue;
				var srcFile = dlintLocationString.filename;

				tmp = queryDB;
				if (!tmp[benchmark]) {
					mismatchDLintWarning(dlintWarning, benchmark, website, dlint_jsonFileLocation);
					continue;
				}
				tmp = tmp[benchmark];
				if (!tmp[filename]) {
					mismatchDLintWarning(dlintWarning, benchmark, website, dlint_jsonFileLocation);
					continue;
				}

				tmp = tmp[filename];

				if (!tmp[srcFile]) {
					mismatchDLintWarning(dlintWarning, benchmark, website, dlint_jsonFileLocation);
					continue dlintLoop2;
				}
				tmp = tmp[srcFile];

				if (!tmp[dlintLocationString.line + ':' + dlintLocationString.column]) {
					mismatchDLintWarning(dlintWarning, benchmark, website, dlint_jsonFileLocation);
					continue dlintLoop2;
				}

				warnings = tmp[dlintLocationString.line + ':' + dlintLocationString.column];
				curWarning = JSON.stringify(dlintWarning);

				matched = false;
				dlintLoop3: for (j = 0; j < warnings.length; j++) {
					warningstr = JSON.stringify(warnings[j]);
					if (warningstr === curWarning) {
						matchDLintWarning(dlintWarning, benchmark, 
							website, dlint_jsonFileLocation, jshint_jsonFileLocation);
						matched = true;
						break dlintLoop3;
					}
				}
				if (matched === false) {
					mismatchDLintWarning(dlintWarning, benchmark, website, dlint_jsonFileLocation);
				}
			}
		}
	}

	function statisticsPost() {}

	// analyse location string of dlint
	// a location string sample: 
	// (/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/
	//	gitprojects/jalangi-dlint/instrumentFF_tmp/httpnetdna.bootstrapcdn.
	// comtwitter-bootstrap2.2.2jsbootstrap.min.js:6:23629:6:23669)
	function analyseDlintLocationString(locationStr) {
		locationStrRegexp.lastIndex = 0;
		var regExpRes = locationStrRegexp.exec(locationStr);
		locationStrRegexp.lastIndex = 0;
		if (!regExpRes) {
			//console.log('unrecognizable location string: ' + locationStr);
			return;
		}
		return {
			filename: regExpRes[1],
			line: regExpRes[2] | 0,
			column: regExpRes[3] | 0,
			endLine: regExpRes[4] | 0,
			endColumn: regExpRes[5] | 0
		};
	}

	// override the following functions to implement
	// the analysis
	/* This is a sample of jshint warning and a dlint warning
		{
		    "jshint": {
		      "benchmark": "websites",
		      "filename": "www.yourdictionary.com_biannulate",
		      "srcFile": "httpcf.ydcdn.net1.0.1.26jspreload.js",
		      "type": "document.write can be a form of eval.",
		      "scope": "(main)",
		      "code": "W060",
		      "details": "document.write can be a form of eval.",
		      "line": 50,
		      "column": 13
		    },
		    "dlint": {
		      "analysis": "DoubleEvaluation",
		      "iid": "143058017",
		      "locationString": "(/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/instrumentFF_tmp/httpcf.ydcdn.net1.0.1.26jspreload.js:50:13:50:254)",
		      "details": "Call eval in the form of direct or indirect eval or setInterval with code string or setTimeout with code string or Function or document.write at (/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/instrumentFF_tmp/httpcf.ydcdn.net1.0.1.26jspreload.js:50:13:50:254) 1 time(s).",
		      "count": 1
		    }
		  },
	*/

	function matchJSHintWarning(jshintWarning) {}

	function matchDLintWarning(dlintWarning) {}

	function mismatchJSHintWarning(jshintWarning) {}

	function mismatchDLintWarning(dlintWarning) {}

	var module = {};
	exports.module = module;

	module.setMatchJSHintWarning = function(callback) {
		matchJSHintWarning = callback;
	};

	module.setMatchDLintWarning = function(callback) {
		matchDLintWarning = callback;
	};

	module.setMismatchJSHintWarning = function(callback) {
		mismatchJSHintWarning = callback;
	};

	module.setMismatchDLintWarning = function(callback) {
		mismatchDLintWarning = callback;
	};

	module.setPostProcessingProcedure = function(callback) {
		statisticsPost = callback;
	};

	module.setBaseDIR = function(dir) {
		baseDIR = dir;
	};

	var baseDIR = process.cwd();
	module.run = function() {
		// iterate through all JSHint and DLint results
		dataIterator.setDataDir(baseDIR);
		dataIterator.iterate_All_Lint_Result_in_JSON(statistics, statisticsPost);
	};

})();