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
	This module is written to collect DLint warning statistics from the raw dataset
*/

(function() {
	var fs = require('fs');
	var path = require('path');
	var expConfig = require('./ExpConfig.js').module;
	var dataIterator = require('./iterator.js').iterator;
	var summary = {};
	var cwd = process.cwd();
	var summaryFile = './exp/DLint-statistics.csv';
	summaryFile = path.resolve(cwd + '/' + summaryFile);

	dataIterator.setDataDir(process.cwd());
	// iterate through all JSHint results
	dataIterator.iterate_DLint_Result_in_JSON(statistics, statisticsPost);

	function statistics(benchmark, website, srcFilename, srcFileLocation) {
		var content = fs.readFileSync(srcFileLocation, 'utf8');
		var idx, urlIdx, dlintContent = JSON.parse(content);
		var pageItem, dlintWarning;

		// iterate through all urls
		for (urlIdx = 0; urlIdx < dlintContent.length; urlIdx++) {
			pageItem = dlintContent[urlIdx];
			// iterate through all dlint warnings
			for (idx = 0; idx < pageItem.value.length; idx++) {
				dlintWarning = pageItem.value[idx];
				summary[dlintWarning.analysis] = (summary[dlintWarning.analysis] || 0) + 1;
			}
		}
	}

	function statisticsPost() {
		var analysis, result = 'analysis, count\r\n';
		for (analysis in summary) {
			if (!summary.hasOwnProperty(analysis)) 
				continue;
			result += (analysis + ',' + summary[analysis] + '\r\n');
		}
		fs.writeFileSync(summaryFile, result);
		console.log('result write into file: ' + summaryFile);
	}
})();