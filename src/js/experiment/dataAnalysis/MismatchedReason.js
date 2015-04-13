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
	This script is written to analyse the matched and mismatched warnings:
	1. print out the mismatched Dlint Warnings

 	It will scan the following file to find out which warnings are
	matched:
	```
	exp/Warning-Mismatched.csv
	```
 */

(function() {
	var analysisFramework = require('./lib/AnalyseMatchingStatistics.js').module;
	var cwd = process.cwd();
	var fs = require('fs');
	var path = require('path');
	var expConfig = require('../ExpConfig.js').module;
	var dataBaseDIR = process.cwd() + '/';

	var resultDB = [];
	var locationBase = '\\/Users\\/jacksongl\\/macos-workspace\\/research\\/jalangi\\/github_dlint\\/gitprojects\\/jalangi-dlint\\/instrumentFF_tmp\\/';
	var locationStrRegexp = new RegExp('\\(' + locationBase + '([^:]+):(\\d+):(\\d+):(\\d+):(\\d+)\\)', 'g');

	var resultFile = './exp/Warning-Mismatched.csv';
	resultFile = path.resolve(cwd + '/' + resultFile);

	fs.writeFileSync(resultFile, 'result:\r\n');

	analysisFramework.setMatchJSHintWarning(matchJSHintWarning);
	analysisFramework.setMatchDLintWarning(matchDLintWarning);
	analysisFramework.setMismatchJSHintWarning(mismatchJSHintWarning);
	analysisFramework.setMismatchDLintWarning(mismatchDLintWarning);
	analysisFramework.setPostProcessingProcedure(statisticsPost);
	analysisFramework.run();

	function replaceAll(str, oldStr, newStr) {
		if (typeof str !== 'string') {
			return str;
		}
		while (str.indexOf(oldStr) >= 0) {
			str = str.replace(oldStr, newStr);
		}
		return str;
	}

	function matchJSHintWarning(jshintWarning, benchmark, website) {}

	function matchDLintWarning(dlintWarning, benchmark, website) {}

	function mismatchJSHintWarning(jshintWarning, benchmark, website) {}

	function getContent(file, line, col, endLine, endCol) {
		if (endLine - line > 20) {
			return 'multiple lines, skip';
		}
		var lineStr;
		try {
			var content = fs.readFileSync(file, 'utf8');
			var lines = content.split('\n');
			//console.log(lines);
			//console.log(line);
			for (var i = line - 1; i <= endLine - 1; i++) {
				if (i === line - 1) { // if it is the first line
					lineStr = lines[line - 1];
					if (i !== endLine - 1) { // and not the last line
						lineStr = lineStr.substring(col - 1, lineStr.length) + '\n';
					} else {
						lineStr = lineStr.substring(col - 1, endCol - 1) + '\n';
					}
				} else if (i === endLine - 1) { // if it is the last line
					if (i !== line - 1) { // but not the first line
						lineStr += lines[i].substring(0, endCol - 1) + '\n';
					} else {
						// nothing should have done in previous branches.
						// lineStr = lineStr.substring(col-1, endCol-1) + '\n';
					}
				} else {
					lineStr += lines[i] + '\n';
				}
			}

		} catch (ex) {
			console.log('exception when retrieving content from file: ' + file)
		}
		return lineStr;
	}

	// analyse location string of dlint
	// a location string sample: 
	// (/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/instrumentFF_tmp/httpnetdna.bootstrapcdn.comtwitter-bootstrap2.2.2jsbootstrap.min.js:6:23629:6:23669)
	function analyseDlintLocationString(locationStr, benchmark, website) {
		var fileLocation, iidFileLocation;
		locationStrRegexp.lastIndex = 0;
		var regExpRes = locationStrRegexp.exec(locationStr);
		locationStrRegexp.lastIndex = 0;
		if (!regExpRes) {
			//console.log('unrecognizable location string: ' + locationStr);
			return;
		}
		fileLocation = dataBaseDIR + benchmark + '/' + website + '/src/' + regExpRes[1];
		iidFileLocation = fileLocation + '_jalangi_sourcemap.js';
		return {
			filename: regExpRes[1],
			line: regExpRes[2] | 0,
			col: regExpRes[3] | 0,
			endLine: regExpRes[4] | 0,
			endCol: regExpRes[5] | 0,
			file: fileLocation,
			iidFileLocation: iidFileLocation
		};
	}

	function mismatchDLintWarning(dlintWarning, benchmark, website) {
		if (expConfig.shouldRemove2(dlintWarning.analysis))
			return;
		var item = {};
		item.dlintWarning = dlintWarning;
		item.benchmark = benchmark;
		item.website = website;
		var location = analyseDlintLocationString(dlintWarning.locationString, benchmark, website);
		var lineStr = getContent(location.file, location.line, location.col, location.endLine, location.endCol);
		item.codeSnippet = lineStr;
		//console.log(lineStr);
		//resultDB.push(item);
		fs.appendFileSync(resultFile, JSON.stringify(item, 0, 2) + '\r\n');
	}

	function statisticsPost() {
		console.log('Result written into:\r\n\t' + resultFile);
	}

})();