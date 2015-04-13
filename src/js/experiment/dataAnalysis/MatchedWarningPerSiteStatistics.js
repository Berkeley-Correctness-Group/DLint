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
	of each website analyzed.
 	It will scan the following file to find out which warnings are
	matched:
	```
	exp/Warning-statistics-per-site.csv
	```
 */

(function() {
	var analysisFramework = require('./lib/AnalyseMatchingStatistics.js').module;
	var cwd = process.cwd();
	var fs = require('fs');
	var path = require('path');
	var config = require('../ExpConfig.js').module;

	var statisticsDB = {};
	var matchedWarnings = {};
	var matchedInfoFile = './exp/Matched-analysis.json';
	var firstScan = true;
	// if json file exists first scan = false;, read matchedWarnings from json file
	// to be done
	//

	if (fs.existsSync(matchedInfoFile)) {
		firstScan = false;
		matchedWarnings = JSON.parse(fs.readFileSync(matchedInfoFile, 'utf8'));
	}


	var resultFile = './exp/Matched-Warning-statistics-per-site.csv';
	resultFile = path.resolve(cwd + '/' + resultFile);

	analysisFramework.setMatchJSHintWarning(matchJSHintWarning);
	analysisFramework.setMatchDLintWarning(matchDLintWarning);
	analysisFramework.setMismatchJSHintWarning(mismatchJSHintWarning);
	analysisFramework.setMismatchDLintWarning(mismatchDLintWarning);
	analysisFramework.setPostProcessingProcedure(statisticsPost);
	analysisFramework.run();

	function initPath(benchmark, website, warningType) {
		var curRef = statisticsDB;
		if (!(curRef[benchmark])) {
			curRef[benchmark] = {};
		}
		curRef = curRef[benchmark];

		if (!(curRef[website])) {
			curRef[website] = {};
		}
		curRef = curRef[website];

		if (!(curRef[warningType])) {
			curRef[warningType] = {};
		}
		curRef = curRef[warningType];

		return curRef;
	}

	function replaceAll(str, oldStr, newStr) {
		if (typeof str !== 'string') {
			return str;
		}
		while (str.indexOf(oldStr) >= 0) {
			str = str.replace(oldStr, newStr);
		}
		return str;
	}

	function matchJSHintWarning(jshintWarning, benchmark, website) {
		if (config.shouldRemove2(jshintWarning.code))
			return;
		if (firstScan) {
			matchedWarnings[jshintWarning.code] = true;
		} else {
			if (matchedWarnings[jshintWarning.code]) {
				website = replaceAll(website, ',', '');
				var db = initPath(benchmark, website, 'jshint');
				db.match = (db.match | 0) + 1;
			}
		}
	}

	function matchDLintWarning(dlintWarning, benchmark, website) {
		if (firstScan) {
			matchedWarnings[dlintWarning.analysis] = true;
		} else {
			if (matchedWarnings[dlintWarning.analysis]) {
				website = replaceAll(website, ',', '');
				var db = initPath(benchmark, website, 'dlint');
				db.match = (db.match | 0) + 1;
			}
		}
	}

	function mismatchJSHintWarning(jshintWarning, benchmark, website) {
		if (config.shouldRemove2(jshintWarning.code))
			return;
		if (firstScan) {
			// nothing
		} else {
			if (matchedWarnings[jshintWarning.code]) {
				website = replaceAll(website, ',', '');
				var db = initPath(benchmark, website, 'jshint');
				db.mismatch = (db.mismatch | 0) + 1;
			}
		}
	}

	function mismatchDLintWarning(dlintWarning, benchmark, website) {
		if (firstScan) {
			// nothing
		} else {
			if (matchedWarnings[dlintWarning.analysis]) {
				website = replaceAll(website, ',', '');
				var db = initPath(benchmark, website, 'dlint');
				db.mismatch = (db.mismatch | 0) + 1;
			}
		}
	}

	function statisticsPost() {
		if (firstScan) {
			fs.writeFileSync(matchedInfoFile, JSON.stringify(matchedWarnings, 0, 2));
		} else {
			var benchmark, site, dbRef;
			fs.writeFileSync(resultFile, 'Warning per site statistics:\r\nSite, JSHint-Matched, JSHint-Mismatched, JSHint-Total, DLint-Matched, DLint-Mismatched, DLint-Total\r\n');

			for (benchmark in statisticsDB) {
				if (!(statisticsDB.hasOwnProperty(benchmark)))
					continue;
				for (site in statisticsDB[benchmark]) {
					if (!(statisticsDB[benchmark].hasOwnProperty(site)))
						continue;
					dbRef = statisticsDB[benchmark][site];
					if(!dbRef.jshint) dbRef.jshint = {};
					if(!dbRef.dlint) dbRef.dlint = {};
					fs.appendFileSync(resultFile, site + ',' +
						(dbRef.jshint.match | 0) + ',' + (dbRef.jshint.mismatch | 0) + ',' +
						((dbRef.jshint.match | 0) + (dbRef.jshint.mismatch | 0)) + ',' +
						(dbRef.dlint.match | 0) + ',' + (dbRef.dlint.mismatch | 0) + ',' +
						((dbRef.dlint.match | 0) + (dbRef.dlint.mismatch | 0)) + '\r\n');
				}
			}
			console.log('Result written into:\r\n\t' + resultFile);
		}
	}

})();