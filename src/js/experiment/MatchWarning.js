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
 * This module is written to match the result of JSHint and DLint
 * This is the first and naive implementation using line and column
 * distance to do exact and blur matching.
 */

(function() {
	var fs = require('fs');
	var path = require('path');
	var dataIterator = require('./iterator.js').iterator;
	var cwd = process.cwd();
	var locationBase = '\\/Users\\/jacksongl\\/macos-workspace\\/research\\/jalangi\\/github_dlint\\/gitprojects\\/jalangi-dlint\\/instrumentFF_tmp\\/';
	var locationStrRegexp = new RegExp('\\(' + locationBase + '([^:]+):(\\d+):(\\d+):(\\d+):(\\d+)\\)', 'g');
	var columnMatchErrorThreshold = 5;
	var lineMatchErrorThreshold = 0;
	var maxColPerLine = 50000000;
	var expConfig = require('./ExpConfig.js').module;
	var matchingStatistics;
	var dataBaseDIR = process.cwd() + '/';

	var JSHintDB = require('./JSHintDB.js').JSHintDB;
	var resDB = [];
	var extraResDB = [];
	var summaryFile = './exp/JSHint-DLint-matching.json';
	var numTotalMatch = 0;
	summaryFile = path.resolve(cwd + '/' + summaryFile);

	var summaryFileExtra = path.resolve(cwd + '/' + './exp/JSHint-DLint-matching-extra.json');
	var iidsCache = {};

	dataIterator.setDataDir(process.cwd());

	function comparison(benchmark, website, jshint_jsonFile, jshint_jsonFileLocation, dlint_jsonFile, dlint_jsonFileLocation) {
		iidsCache = {};
		console.log('matching warnings in ' + benchmark + '-' + website);
		var matchingStatistics = {};
		var pageItem, urlIdx, idx, idx2, jshintpage, jshintFilename, jshintLine, jshintCol, dlintLocation;
		var jshintContent = fs.readFileSync(jshint_jsonFileLocation, 'utf8');
		var dlintContent = fs.readFileSync(dlint_jsonFileLocation, 'utf8');
		var jshintLocID, dlintStartLocID, dlintEndLocID;
		jshintContent = JSON.parse(jshintContent);
		dlintContent = JSON.parse(dlintContent);
		var numMatch = 0;
		var jshintType, dlintWarning;

		// iterate through all jshint warnings
		loop1: for (idx = 0; idx < jshintContent.length; idx++) {
			jshintType = jshintContent[idx].code;
			if (expConfig.shouldRemove(jshintType))
				continue loop1;

			jshintLine = jshintContent[idx].line | 0;
			jshintCol = jshintContent[idx].column | 0;
			jshintpage = jshintContent[idx].filename;
			jshintFilename = jshintContent[idx].srcFile;
			jshintLocID = jshintLine * maxColPerLine + jshintCol;

			//console.log('loop1');
			// iterate through all urls
			loop2: for (urlIdx = 0; urlIdx < dlintContent.length; urlIdx++) {
				//console.log('\tloop2');
				pageItem = dlintContent[urlIdx];
				//if (pageItem.url !== jshintpage) {
				//	break loop2;
				//}
				// iterate through all dlint warnings
				loop3: for (idx2 = 0; idx2 < pageItem.value.length; idx2++) {
					if (expConfig.shouldRemove2(pageItem.value[idx2].analysis))
						continue loop3;
					//console.log('\t\tloop3');
					//console.log(idx2 + '/' + pageItem.value.length);
					dlintWarning = JSON.parse(JSON.stringify(pageItem.value[idx2])); // copy
					dlintLocation = analyseDlintLocationString(dlintWarning.locationString,
						benchmark, website);
					if (!dlintLocation)
						continue loop3;

					dlintStartLocID = dlintLocation.line * maxColPerLine + dlintLocation.column;
					dlintEndLocID = dlintLocation.endLine * maxColPerLine + dlintLocation.endColumn;

					// use rules to filter out false positive matches
					if (!expConfig.canMatch(jshintType, dlintWarning.analysis)) {
						continue loop3;
					}

					// accurate match
					if (jshintFilename === dlintLocation.filename &&
						jshintLine === dlintLocation.line &&
						jshintCol === dlintLocation.column) {

						var resItem = {};
						resDB.push(resItem);
						resItem.jshint = jshintContent[idx];
						resItem.dlint = dlintWarning;
						// make this dlint warning umatchable
						pageItem.value[idx2].locationString = '';
						addMatchStatistics(jshintContent[idx].type, dlintWarning.analysis);
						numMatch++;
						continue loop1; // match next jshint warning

					} else {

						// not exact match
						if (jshintFilename === dlintLocation.filename &&
							Math.abs(dlintEndLocID - dlintStartLocID) < 40 &&
							jshintLocID >= dlintStartLocID && jshintLocID <= dlintEndLocID) {

							// bound match
							var resItem = {};
							resDB.push(resItem);
							resItem.jshint = jshintContent[idx];
							resItem.dlint = dlintWarning;
							// make this dlint warning umatchable
							pageItem.value[idx2].locationString = '';
							addMatchStatistics(jshintContent[idx].type, dlintWarning.analysis);
							numMatch++;
							break loop2;

						} else if (jshintFilename === dlintLocation.filename &&
							Math.abs(jshintLine - dlintLocation.line) <= lineMatchErrorThreshold &&
							Math.abs(jshintCol - dlintLocation.column) <= columnMatchErrorThreshold) {
							// blur match
							var resItem = {};
							resDB.push(resItem);
							resItem.jshint = jshintContent[idx];
							resItem.dlint = dlintWarning;
							// make this dlint warning umatchable
							pageItem.value[idx2].locationString = '';
							addMatchStatistics(jshintContent[idx].type, dlintWarning.analysis);
							numMatch++;
							break loop2;

						} else if (jshintFilename === dlintLocation.filename) {
							// blur matching based on nearby IIDs
							var iid = (dlintWarning.iid | 0);
							var IIDs = loadIID(dlintLocation.iidFileLocation, iid);
							var iidArray = getNearByIIDs(IIDs, iid);
							var lineColArray = fuzzConvertToLineCol(iidArray, IIDs);
							//console.log(lineColArray);
							for (var i = 0; i < lineColArray.length; i++) {
								if (jshintLine === lineColArray[i].line &&
									jshintCol === lineColArray[i].col) {
									// matched 
									var resItem = {};
									resDB.push(resItem);
									extraResDB.push(resItem);
									resItem.jshint = jshintContent[idx];
									resItem.dlint = dlintWarning;
									// make this dlint warning umatchable
									pageItem.value[idx2].locationString = '';
									addMatchStatistics(jshintContent[idx].type, dlintWarning.analysis);
									numMatch++;
									break loop2;
								}
							}
						}
					}
					/*else {
						console.log(jshintFilename);
						console.log('  ' + dlintLocation.filename);
						console.log(jshintLine);
						console.log('  ' + dlintLocation.line);
						console.log(jshintCol);
						console.log('  ' + dlintLocation.column);
					}*/
				}
			}
		}
		console.log('Match in this site: ' + numMatch);
		numTotalMatch += numMatch;
		console.log('Current total match: ' + numTotalMatch);
	}



	function loadIID(iidFileLocation, iid) {
		//console.log(iidFileLocation);
		if (iidsCache[iidFileLocation])
			return iidsCache[iidFileLocation];

		//console.log(iidFileLocation);
		var content = fs.readFileSync(iidFileLocation, 'utf8');
		eval(content);
		var iids = J$.iids;
		J$.iids = undefined;
		iidsCache[iidFileLocation] = iids;
		return iids;
	}


	function loadIID2(iidFileLocation, iid) {
		//console.log(iidFileLocation);
		var iidRegexp = new RegExp('(iids\\[\\d+\\][= ]+[^;]+;\\s*){0,6}iids\\[' + iid + '\\][= ]+[^;]+;(\\s*iids\\[\\d+\\][= ]+[^;]+;){0,6}');
		var content = fs.readFileSync(iidFileLocation, 'utf8');
		console.log('matching');
		var str = content.match(iidRegexp)[0];
		console.log('matching done');
		var iids = [];
		var fn = -1;
		eval(str);
		//console.log('done');
		return iids;
	}

	function fuzzConvertToLineCol(iidArray, IIDs) {
		//console.log(iidArray);
		var i, iid, line, col;
		var ret = [];
		for (i = 0; i < iidArray.length; i++) {
			iid = iidArray[i];
			line = IIDs[iid][1];
			col = IIDs[iid][2];
			ret.push({
				line: line,
				col: col
			});
			ret.push({
				line: line,
				col: (col + 1)
			});
			ret.push({
				line: line,
				col: (col - 1)
			});
		}
		return ret;
	}

	function getNearByIIDs(IIDs, iid) {
		//console.log(iid);
		var array = [];
		var nearByNum = 4;
		if (IIDs[iid])
			array.push(iid);
		for (var i = 1; i < nearByNum; i++) {
			if (IIDs[iid - i * 8]) {
				array.push(iid - i * 8);
			}

			if (IIDs[iid + i * 8]) {
				array.push(iid + i * 8);
			}
		}
		return array;
	}

	function addMatchStatistics(jshintType, dlintType) {
		if (!matchingStatistics)
			matchingStatistics = {};
		var id = jshintType + ' <--> ' + dlintType;
		matchingStatistics[id] = (matchingStatistics[id] | 0) + 1;
	}

	function printMatchStatistics() {
		console.log('Matching Statistics:');
		if (!matchingStatistics) {
			console.log('empty');
			return;
		}
		for (var id in matchingStatistics) {
			if (!(matchingStatistics.hasOwnProperty(id)))
				continue;
			console.log(id + ' : ' + matchingStatistics[id]);
		}
		console.log();
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
			column: regExpRes[3] | 0,
			endLine: regExpRes[4] | 0,
			endColumn: regExpRes[5] | 0,
			fileLocation: fileLocation,
			iidFileLocation: iidFileLocation
		};
	}

	function comparisonPost() {
		console.log('Total match: ' + numTotalMatch);
		var result = JSON.stringify(resDB, 0, 2);
		fs.writeFileSync(summaryFile, result);
		result = JSON.stringify(extraResDB, 0, 2);
		fs.writeFileSync(summaryFileExtra, result);
		printMatchStatistics();
		console.log('result write into file: ' + summaryFile);
	}


	var module = {};
	exports.expModule = module;

	module.setMatchingParameters = function(lineError, colError) {
		lineMatchErrorThreshold = lineError;
		columnMatchErrorThreshold = colError;
	};

	module.setDataDir = function(dir) {
		dataIterator.setDataDir(dir);
	};

	module.setResultLocation = function(fileLocation) {
		summaryFile = fileLocation;
	};

	module.startExperiment = function() {
		// iterate through all JSHint results
		dataIterator.iterate_All_Lint_Result_in_JSON(comparison, comparisonPost);
	};
})();