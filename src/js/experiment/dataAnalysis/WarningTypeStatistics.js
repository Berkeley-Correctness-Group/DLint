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
	This script is written to analyse the matching and mismathcing statistics
	of each warning type of JSHint and JSLint.
 	It will scan the following file to find out which warnings are
	matched:
	```
	exp/JSHint-DLint-matching.json
	```
 */

(function() {
	var analysisFramework = require('./lib/AnalyseMatchingStatistics.js').module;
	var cwd = process.cwd();
	var fs = require('fs');
	var path = require('path');

	var statisticsDB = {
		jshint: {},
		dlint: {}
	};

	var resultFile = './exp/JSHint-DLint-statistics.csv';
	resultFile = path.resolve(cwd + '/' + resultFile);

	analysisFramework.setMatchJSHintWarning(matchJSHintWarning);
	analysisFramework.setMatchDLintWarning(matchDLintWarning);
	analysisFramework.setMismatchJSHintWarning(mismatchJSHintWarning);
	analysisFramework.setMismatchDLintWarning(mismatchDLintWarning);
	analysisFramework.setPostProcessingProcedure(statisticsPost);
	analysisFramework.run();

	function matchJSHintWarning(jshintWarning) {
		if (!(statisticsDB.jshint[jshintWarning.type])) {
			statisticsDB.jshint[jshintWarning.type] = {};
		}
		statisticsDB.jshint[jshintWarning.type].match =
			(statisticsDB.jshint[jshintWarning.type].match | 0) + 1;
	}

	function matchDLintWarning(dlintWarning) {
		if (!(statisticsDB.dlint[dlintWarning.analysis])) {
			statisticsDB.dlint[dlintWarning.analysis] = {};
		}
		statisticsDB.dlint[dlintWarning.analysis].match =
			(statisticsDB.dlint[dlintWarning.analysis].match | 0) + 1;
	}

	function mismatchJSHintWarning(jshintWarning) {
		if (!(statisticsDB.jshint[jshintWarning.type])) {
			statisticsDB.jshint[jshintWarning.type] = {};
		}
		statisticsDB.jshint[jshintWarning.type].mismatch =
			(statisticsDB.jshint[jshintWarning.type].mismatch | 0) + 1;
	}

	function mismatchDLintWarning(dlintWarning) {
		if (!(statisticsDB.dlint[dlintWarning.analysis])) {
			statisticsDB.dlint[dlintWarning.analysis] = {};
		}
		statisticsDB.dlint[dlintWarning.analysis].mismatch =
			(statisticsDB.dlint[dlintWarning.analysis].mismatch | 0) + 1;
	}

	function statisticsPost() {
		//console.log(JSON.stringify(statisticsDB, 0, 2));
		var prop, jshint, dlint;
		fs.writeFileSync(resultFile, 'JSHint Statistics:\r\nType, Matched, Mismatched, Total\r\n');
		jshint = statisticsDB.jshint;
		for (prop in jshint) {
			if (!(jshint.hasOwnProperty(prop)))
				continue;
			fs.appendFileSync(resultFile, prop + ',' + (jshint[prop].match | 0) +
				',' + (jshint[prop].mismatch | 0) + ',' + ((jshint[prop].match | 0) +
					(jshint[prop].mismatch | 0)) + '\r\n');
		}

		fs.appendFileSync(resultFile, '\r\n\r\nDLint Statistics:\r\nType, Matched, Mismatched, Total\r\n');
		dlint = statisticsDB.dlint;
		for (prop in dlint) {
			if (!(dlint.hasOwnProperty(prop)))
				continue;
			fs.appendFileSync(resultFile, prop + ',' + (dlint[prop].match | 0) +
				',' + (dlint[prop].mismatch | 0) + ',' + ((dlint[prop].match | 0) +
					(dlint[prop].mismatch | 0)) + '\r\n');
		}

		console.log('Result written into:\r\n\t' + resultFile);
	}

})();