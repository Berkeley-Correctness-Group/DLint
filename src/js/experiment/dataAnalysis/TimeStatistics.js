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
	Go over all Timer.js warnings
	collect information on:
	starting time of DLint
	starting time of execution
	ending time of execution
	ending time of DLint
*/
(function() {
	// var Beautifier = require('node-js-beautify');
	// var beautifier = new Beautifier(); // "awesome"
	var stats = require('stats');

	var fs = require('fs');
	var path = require('path');
	var dataIterator = require('../iterator.js').iterator;
	var cwd = process.cwd();
	var dataBaseDir = process.cwd() + '/';
	var resultDB = {};
	var summaryFile = './exp/Time-statistics.csv';
	summaryFile = path.resolve(cwd + '/' + summaryFile);

	dataIterator.setDataDir(dataBaseDir);
	// iterate through all JSHint results
	dataIterator.iterate_DLint_Result_in_JSON(statistics, statisticsPost);

	function statistics(benchmark, website, srcFilename, srcFileLocation) {
		console.log('processing: ' + benchmark + '-' + website);
		var content = fs.readFileSync(srcFileLocation, 'utf8');
		var idx, urlIdx, dlintContent = JSON.parse(content);
		var pageItem, dlintWarning, url, numWarning = 0;

		// iterate through all urls
		for (urlIdx = 0; urlIdx < dlintContent.length; urlIdx++) {
			pageItem = dlintContent[urlIdx];
			// iterate through all dlint warnings
			for (idx = 0; idx < pageItem.value.length; idx++) {
				dlintWarning = pageItem.value[idx];
				url = pageItem.url;
				if (dlintWarning.analysis === 'Timer') {
					processWarning(website, dlintWarning, benchmark, website);
				} else {
					numWarning++;
				}
			}
		}
		resultDB[website].totalNumDlintWarning = numWarning;
	}

	/*
		structure of resultDB:
		resultDB[url].coveredNumLine = (resultDB[url].coveredNumLine | 0) + uniqueCnt;
		resultDB[url].executedNumLine = (resultDB[url].executedNumLine | 0) + totalLineExecutedCnt;
		resultDB[url].totalNumLine = (resultDB[url].totalNumLine | 0) + statRes.statements;
		resultDB[url].coveredNumOp = (resultDB[url].coveredNumOp | 0) + uniqueIidCnt;
		resultDB[url].executedNumOp = (resultDB[url].executedNumOp | 0) + totalIIDExecutedCnt;
		resultDB[url].totalNumOp = (resultDB[url].totalNumOp | 0) + totalIids;
		resultDB[website].totalNumDlintWarning = numWarning;
	*/
	function statisticsPost() {
		var url;
		var propList = ['startDLintTime', 'startExecutionTime', 'endExecutionTime', 
		'endDLintTime'];
		console.log(JSON.stringify(resultDB, 0, 2));
		fs.writeFileSync(summaryFile, 'url,' + propList.join(',') + '\r\n');
		for (url in resultDB) {
			if (!(resultDB.hasOwnProperty(url))) continue;
			var line = url;
			for(var i=0;i<propList.length;i++) {
				line = line + ',' + resultDB[url][propList[i]];
			}
			fs.appendFileSync(summaryFile, line + '\r\n');
		}
		console.log('Result written into:\r\n\t' + summaryFile);
	}

	/*
	sample of an ExeStat warning:
	{
		"analysis": "ExeStat",
		"iid": 0,
		"locationString": "whole-site",
		"details": "[{\"filename\":\"/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/instrumentFF_tmp/httpresource.squaretrade.comjavascriptcommonthirdpartyjqueryjquery-1.7.1.min.js\",\"executedLines\":{\"159337\":1}},{\"filename\":\"/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/instrumentFF_tmp/httpresource.squaretrade.comjavascriptcommonthirdpartyjqueryjquery-1.7.1.min.js\",\"executedLines\":{\"159345\":1,\"158017\":1,\"158025\":1,\"158033\":1,\"158041\":1,\"158049\":1,\"158057\":1,\"158065\":1,\"158073\":1,]",
		"count": 1
	}]
	*/
	function processWarning(url, dlintWarning, benchmark, website) {
		var execDB = JSON.parse(dlintWarning.details);
		resultDB[url] = {};
		resultDB[url].startExecutionTime = execDB.startTime;
		resultDB[url].endExecutionTime = execDB.endTime;

		// load time.txt
		var file = dataBaseDir + benchmark + '/' + website + '/time.txt';
		var content = fs.readFileSync(file, 'utf8');
		var times = content.split('\n');
		resultDB[url].startDLintTime = parseInt(times[0]);
		resultDB[url].endDLintTime = parseInt(times[1]);
	}
})();