/*
 * Copyright (c) 2015, University of California, Berkeley and TU Darmstadt
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

// Author: Michael Pradel (michael@binaervarianz.de)

/**
 * @dlintShort{Find comparisons of a function with a primitive.}
 * @dlintLong{May be problematic if the developer intended to call the function before comparison.}
 * @dlintRule{Avoid comparing a function with a primitive.}
 * @dlintShortName{FunctionVsPrim}
 * @dlintPattern{binOp(relOrEqOp,left,right,*) WHERE isFct(left) AND isPrim(right) ORR
 * binOp(relOrEqOp,left,right,*) WHERE isPrim(left) AND isFct(right)}
 * @dlintGroup{TypeError}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */
(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};
        //var varTypeDB = {};

        /*
        var isReport = true;

        this.putFieldPre = function(iid, base, offset, val) {
            if(base && typeof base[offset] === 'function') {
              if(typeof val === 'boolean')
                isReport = false;
            } else if(base && typeof base[offset] === 'boolean') {
              if(typeof val === 'function')
                isReport = false;
            }
        };

        this.writePre = function(iid, name, val, lhs, isGlobal, isPseudoGlobal) {
            if(typeof lhs === 'function') {
              if(typeof val === 'boolean')
                isReport = false;
            } else if(typeof lhs === 'boolean') {
              if(typeof val === 'function')
                isReport = false;
            }
        };
        */

        this.binary = function(iid, op, left, right, result) {
            //if(!isReport) return ;
            var type1 = typeof left;
            var type2 = typeof right;
            if (op === '==' ||
                  op === '===' ||
                  op === '!==' ||
                  op === '!=' ||
                  op === '<' ||
                  op === '>' ||
                  op === '<=' ||
                  op === '>=') {
                if ((type1 === 'function' && (type2 === 'string' || type2 === 'number' || type2 === 'boolean')) ||
                      (type2 === 'function' && (type1 === 'string' || type1 === 'number' || type1 === 'boolean'))) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                }
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var details = "Comparing a function with a number or string or boolean at " + location + " " + iidToCount[iid] + " time(s).";
                return new DLintWarning("CompareFunctionWithPrimitives", iid, location, details, iidToCount[iid]);
            });
            /*
            if(isReport) {
              sandbox.DLint.addWarnings(warnings);
            } else {
              sandbox.DLint.addWarnings([]);
            }
            */
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



