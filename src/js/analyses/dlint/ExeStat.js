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
 * This module is written to collect runtime statistics of the target program.
 * Collected statistics:
 * 1. statements covered.
 */
(function(sandbox) {
	function MyAnalysis() {
		var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
		var filenameIdx = {};
		var resultDB = [];

		function stat(iid) {
			var iidItem, filename, i, item;
			var startLine, startCol, endLine, endCol;

			if (sandbox.iids) {
				if ((iidItem = sandbox.iids[iid])) {
					filename = iidItem[0];
				}
			}
			item = initStatItem(filename);
			item.executedLines[iid] = (item.executedLines[iid]|0) + 1;
		}

		function initStatItem(filename) {
			var item;
			if (!filenameIdx[filename]) {
				filenameIdx[filename] = resultDB.length;
				item = {
					'filename': filename,
					executedLines: {}
				};
				resultDB.push(item);
			} else {
				item = resultDB[filenameIdx[filename]];
			}
			return item;
		}

		this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
			stat(iid);
		};

		this.literal = function(iid, val, hasGetterSetter) {
			stat(iid);
		};

		this.forinObject = function(iid, val) {
			stat(iid);
		};

		this.declare = function(iid, name, val, isArgument, argumentIndex, isCatchParam) {
			stat(iid);
		};

		this.getField = function(iid, base, offset, val) {
			stat(iid);
		};

		this.putField = function(iid, base, offset, val) {
			stat(iid);
		};

		this.read = function(iid, name, val, isGlobal, isPseudoGlobal) {
			stat(iid);
		};

		this.write = function(iid, name, val, lhs, isGlobal, isPseudoGlobal) {
			stat(iid);
		};

		this.functionEnter = function(iid, f, dis, args) {
			stat(iid);
		};

		this.functionExit = function(iid, returnVal, exceptionVal) {
			stat(iid);
		};

		this.binary = function(iid, op, left, right, result) {
			stat(iid);
		};

		this.unary = function(iid, op, left, result) {
			stat(iid);
		};

		this.conditional = function(iid, result) {
			stat(iid);
		};

		this.instrumentCode = function(iid, ast) {
			stat(iid);
		};

		this.endExecution = function() {
			var warnings = [];
			warnings.push(new DLintWarning("ExeStat", 0, 'whole-site', JSON.stringify(resultDB), 1));
			sandbox.DLint.addWarnings(warnings);
		};
	}
	sandbox.analysis = new MyAnalysis();
})(J$);