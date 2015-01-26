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

// This analysis checks using the reserved words as reference names
// For example:
// var implements = 1;
// 'implements' is defined as a reserved word for JavaScript.
// Although running the above code in current JS engines would not
// raise any exception, but once the engines starts using the reserved
// word as a keyword, there will be compilation errors.
// So the code is not forward compitable.
// 
// The list of reserved words mainly comes from the following source:
// https://jslinterrors.com/expected-an-identifier-and-instead-saw-a-a-reserved-word
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Future_reserved_keywords
// it should also check if a function uses a reserved word as its name

/**
 * @dlintShort{Find writes to local variables that have a reserved name.}
 * @dlintLong{Reserved names considered here include, e.g., 'enum' and 'float'.}
 * @dlintCanCheckStatically
 * @dlintObsolete
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number

        // the list mainly comes from the following source:
        // https://jslinterrors.com/read-only
        var forbNameList = ['enum', 'await', 'implements', 'static', 'public', 'package', 'interface', 'protected', 'privated', 'abstract', 'float', 'short', 'boolean', 'goto', 'synchronized', 'byte', 'int', 'transient', 'char', 'long', 'volatile', 'double', 'native', 'final', 'let', 'package', 'yield'];

        this.write = function(iid, name, val, lhs, isGlobal, isPseudoGlobal) {
            /*
            forbNameList.map(function(forbName) {
                if (name === forbName) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                }
            });
            */
            if(forbNameList.indexOf(name) >= 0) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
            /*
            return {
                result: val
            };
            */
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("ReservedWordReference", iid, location, "Local variable uses " + forbNameList.join(' or ') + " as variable name at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);