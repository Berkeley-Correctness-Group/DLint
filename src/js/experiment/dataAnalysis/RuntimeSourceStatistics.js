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
	Go over all ExeStat.js warnings
	collect information on:
	how many unique lines of code are covered?
	how many lines of code are executed? (including the count for executing the same line multiple times)
	how many unique operations are covered? (an operation is identified by IID)
	how many operations are executed? (including the count for executing the same operation multiple times)
	total number of lines in the source file
	total number of unique operations in the source file (an operation is identified by IID)
	total dlint warings generated (excluding ExeStat.js warnings)
*/
(function() {
	// var Beautifier = require('node-js-beautify');
	// var beautifier = new Beautifier(); // "awesome"
	var stats = require('stats');

	var fs = require('fs');
	var path = require('path');
	var dataIterator = require('../iterator.js').iterator;
	var cwd = process.cwd();
	// var dataBaseDir = '/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/';
	var dataBaseDir = process.cwd() + '/';
	var resultDB = {};
	var summaryFile = './exp/Runtime-statistics.csv';
	summaryFile = path.resolve(cwd + '/' + summaryFile);

	dataIterator.setDataDir(dataBaseDir);
	dataIterator.setBenchmarks(['websites']);
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
				if (dlintWarning.analysis === 'ExeStat') {
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
		var propList = ['coveredNumLine', 'executedNumLine', 'totalNumLine', 
		'coveredNumOp', 'executedNumOp', 'totalNumOp', 'totalNumDlintWarning'];
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
		var fileIdx, fileExecDB, filename, lines;
		for (fileIdx = 0; fileIdx < execDB.length; fileIdx++) {
			fileExecDB = execDB[fileIdx];
			filename = fileExecDB.filename;
			if(!filename) continue;
			lines = fileExecDB.executedLines;
			try {
				handleWarning(url, filename, lines, benchmark, website);
			} catch(ex) {
				if(!resultDB[url]) resultDB[url] = {};
				// console.log('exception when handling file:' + filename);
			}
		}
	}

	function loadSourceMap(file) {
		var content = fs.readFileSync(file, 'utf8');
		var EVAL = eval;
		EVAL(content);
		var ret = J$.iids;
		delete J$.iids;
		return ret;
	}

	function handleWarning(url, filename, lines, benchmark, website) {
		// switch filelocation
		filename = filename.replace('/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/instrumentFF_tmp/', '');
		var sourceMapFile = dataBaseDir + benchmark + '/' + website + '/src/' + filename + '_jalangi_sourcemap.js';
		filename = dataBaseDir + benchmark + '/' + website + '/src/' + filename;
		var sourceMap = loadSourceMap(sourceMapFile);
		var totalLineExecutedCnt = 0;
		var totalIIDExecutedCnt = 0;
		var uniqueIidCnt = 0;
		var lineSet = {};

		// get statistics of the source file
		var fileContent = fs.readFileSync(filename, 'utf8');
		// console.log(fileContent);
		var statRes = stats.parse(fileContent);
		var totalIids = 0;
		// get total number of iids
		for (var iid in sourceMap) {
			if (!(sourceMap.hasOwnProperty(iid))) continue;
			totalIids++;
		}

		for (var iid in lines) {
			if (!(lines.hasOwnProperty(iid))) continue;
			var count = lines[iid];
			var item = sourceMap[iid];
			var startLine = item[1];
			var endLine = item[3];
			totalIIDExecutedCnt += count;
			uniqueIidCnt++;

			for (var i = startLine; i <= endLine; i++) {
				lineSet[i] = true;
				totalLineExecutedCnt += count;
			}
		}

		var uniqueCnt = 0;
		for (var i in lineSet) {
			if (!(lineSet.hasOwnProperty(i))) continue;
			uniqueCnt++;
		}

		if (!resultDB[url]) {
			resultDB[url] = {};
		}
		resultDB[url][filename] = {
			coveredNumLine: uniqueCnt,
			executedNumLine: totalLineExecutedCnt,
			totalNumLine: statRes.statements,
			coveredNumOp: uniqueIidCnt,
			executedNumOp: totalIIDExecutedCnt,
			totalNumOp: totalIids
		};

		resultDB[url].coveredNumLine = (resultDB[url].coveredNumLine | 0) + uniqueCnt;
		resultDB[url].executedNumLine = (resultDB[url].executedNumLine | 0) + totalLineExecutedCnt;
		resultDB[url].totalNumLine = (resultDB[url].totalNumLine | 0) + statRes.statements;
		resultDB[url].coveredNumOp = (resultDB[url].coveredNumOp | 0) + uniqueIidCnt;
		resultDB[url].executedNumOp = (resultDB[url].executedNumOp | 0) + totalIIDExecutedCnt;
		resultDB[url].totalNumOp = (resultDB[url].totalNumOp | 0) + totalIids;
	}
})();