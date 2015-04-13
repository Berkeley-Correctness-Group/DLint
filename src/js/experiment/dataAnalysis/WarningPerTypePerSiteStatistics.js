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
	exp/Warning-statistics-per-type-per-site.csv
	```
 */

(function() {
	var analysisFramework = require('./lib/AnalyseMatchingStatistics.js').module;
	var cwd = process.cwd();
	var fs = require('fs');
	var path = require('path');
	var config = require('../ExpConfig.js').module;
	var jshintAnalysisNamesSet = {};
	var dlintAnalysisNamesSet = {};

	var statisticsDB = {};

	var resultFile = './exp/Warning-statistics-per-analysis-per-site.csv';
	resultFile = path.resolve(cwd + '/' + resultFile);

	analysisFramework.setMatchJSHintWarning(matchJSHintWarning);
	analysisFramework.setMatchDLintWarning(matchDLintWarning);
	analysisFramework.setMismatchJSHintWarning(mismatchJSHintWarning);
	analysisFramework.setMismatchDLintWarning(mismatchDLintWarning);
	analysisFramework.setPostProcessingProcedure(statisticsPost);
	analysisFramework.run();

	/*
	 * warningType: jshint | dlint
	 */
	function initPath(benchmark, website, warningType, analysisType) {
		var curRef = statisticsDB;
		if(!(curRef[benchmark])){
			curRef[benchmark] = {};
		}
		curRef = curRef[benchmark];

		if(!(curRef[website])) {
			curRef[website] = {};
		}
		curRef = curRef[website];

		if(!(curRef[warningType])) {
			curRef[warningType] = {};
		}
		curRef = curRef[warningType];

		if(!(curRef[analysisType])) {
			curRef[analysisType] = {};
		}
		curRef = curRef[analysisType];

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
			return ;
		website = replaceAll(website,',','');
		var db = initPath(benchmark, website, 'jshint', jshintWarning.type);
		db.match = (db.match | 0) + 1;
		db.total = (db.total | 0) + 1;
		jshintAnalysisNamesSet[jshintWarning.type] = 1;
	}

	function matchDLintWarning(dlintWarning, benchmark, website) {
		website = replaceAll(website,',','');
		var db = initPath(benchmark, website, 'dlint', dlintWarning.analysis);
		db.match = (db.match | 0) + 1;
		db.total = (db.total | 0) + 1;
		dlintAnalysisNamesSet[dlintWarning.analysis] = 1;
	}

	function mismatchJSHintWarning(jshintWarning, benchmark, website) {
		if (config.shouldRemove2(jshintWarning.code))
			return ;
		website = replaceAll(website,',','');
		var db = initPath(benchmark, website, 'jshint', jshintWarning.type);
		db.mismatch = (db.mismatch | 0) + 1;
		db.total = (db.total | 0) + 1;
		jshintAnalysisNamesSet[jshintWarning.type] = 1;
	}

	function mismatchDLintWarning(dlintWarning, benchmark, website) {
		website = replaceAll(website,',','');
		var db = initPath(benchmark, website, 'dlint', dlintWarning.analysis);
		db.mismatch = (db.mismatch | 0) + 1;
		db.total = (db.total | 0) + 1;
		dlintAnalysisNamesSet[dlintWarning.analysis] = 1;
	}

	function statisticsPost() {
		var benchmark, site, dbRef, name, index, db, val, resString;
		var dlintNamesArray = [];
		var jshintNamesArray = [];
		for(name in jshintAnalysisNamesSet) {
			if(!(jshintAnalysisNamesSet.hasOwnProperty(name))) continue;
			jshintNamesArray.push(name);
		}
		for(name in dlintAnalysisNamesSet) {
			if(!(dlintAnalysisNamesSet.hasOwnProperty(name))) continue;
			dlintNamesArray.push(name);
		}

		fs.writeFileSync(resultFile, 'JSHint Warning per site per analysis type statistics:\r\nSite,' + jshintNamesArray.join(',') + '\r\n');

		resString = '';
		for (benchmark in statisticsDB) {
			if (!(statisticsDB.hasOwnProperty(benchmark)))
				continue;
			for (site in statisticsDB[benchmark]) {
				if (!(statisticsDB[benchmark].hasOwnProperty(site)))
					continue;
				dbRef = statisticsDB[benchmark][site];
				resString += site + ',';
				for (index = 0; index < jshintNamesArray.length; index++) {
					db = dbRef.jshint[jshintNamesArray[index]];
					val = db ? db.total : 0;
					resString += val + ',';
				}
				resString += '\r\n';
			}
		}
		fs.appendFileSync(resultFile, resString);

		fs.appendFileSync(resultFile, '\r\nDLint Warning per site per analysis type statistics:\r\nSite,' + dlintNamesArray.join(',') + '\r\n');

		resString = '';
		for (benchmark in statisticsDB) {
			if (!(statisticsDB.hasOwnProperty(benchmark)))
				continue;
			for (site in statisticsDB[benchmark]) {
				if (!(statisticsDB[benchmark].hasOwnProperty(site)))
					continue;
				dbRef = statisticsDB[benchmark][site];
				if(!dbRef.dlint) dbRef.dlint = {};
				resString += site + ',';
				for (index = 0; index < dlintNamesArray.length; index++) {
					db = dbRef.dlint[dlintNamesArray[index]];
					val = db ? db.total : 0;
					resString += val + ',';
				}
				resString += '\r\n';
			}
		}
		fs.appendFileSync(resultFile, resString);

		console.log('Result written into:\r\n\t' + resultFile);
	}
	
})();