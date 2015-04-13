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
	This module is written to collect JSHint warning statistics from the raw dataset
*/

(function() {
	var fs = require('fs');
	var path = require('path');
	var expConfig = require('./ExpConfig.js').module;
	var dataIterator = require('./iterator.js').iterator;
	var warningSummary = {}, errorSummary = {};
	var cwd = process.cwd();
	var JSHintDB = require('./JSHintDB.js').JSHintDB;
	var summaryFile = './exp/JSHint-statistics.csv';
	summaryFile = path.resolve(cwd + '/' + summaryFile);

	dataIterator.setDataDir(process.cwd());
	// iterate through all JSHint results
	dataIterator.iterate_JSHint_Result_in_JSON(statistics, statisticsPost);

	function statistics(benchmark, website, srcFilename, srcFileLocation) {
		var content = fs.readFileSync(srcFileLocation, 'utf8');
		var code, idx, db = JSON.parse(content);
		for (idx = 0; idx < db.length; idx++) {
			code = db[idx].code;
			if (expConfig.isWarning(code)) {
				warningSummary[code] = (warningSummary[code] + 1) || 1;
			} else if (expConfig.isError(code)) {
				errorSummary[code] = (errorSummary[code] + 1) || 1;
			}
		}
	}

	function statisticsPost() {
		var code, result = 'code, count, detail\r\n';
		for (code in warningSummary) {
			if (!warningSummary.hasOwnProperty(code)) 
				continue;
			result += (code + ',' + warningSummary[code] + ',');
			result += (JSHintDB.all[code] + '\r\n');
		}
		result += '\r\ncode, count, detail\r\n';
		for (code in errorSummary) {
			if (!errorSummary.hasOwnProperty(code)) 
				continue;
			result += (code + ',' + errorSummary[code] + ',');
			result += (JSHintDB.all[code] + '\r\n');
		}
		fs.writeFileSync(summaryFile, result);
		console.log('result write into file: ' + summaryFile);
	}
})();