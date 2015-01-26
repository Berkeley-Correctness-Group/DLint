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

/**
 * @dlintShort{Find inconsistent usages of constructor functions.}
 * @dlintLong{Warns if a function is called both with and without the 'new' keyword.}
 * @dlintPattern{call(*,f,*,*,false) AND call(*,f,*,*,true)}
 * @dlintRule{Avoid using a function both as constructor and as non-constructor.}
 * @dlintShortName{ConstructorFunctions}
 * @dlintGroup{TypeError}
 * @dlintNeedDynamic
 * @dlintMultiEventPattern
 */

/*
    This analysis detects the inconsistent use of constructor call
    for example, if the following two statements appears at the 
    same time, there will be a warning raised

    var obj = new Constructor();
    ...
    var obj2 = Constructor(); // inconsistent call of constructor function
*/

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number
        var specialProp = '_newPrefixUsage';

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            var newProp;
            // new hidden property of the function
            if (isConstructor) {
                newProp = 'new';
            } else {
                newProp = 'no_new';
            }

            if (f[specialProp]) {
                // if the new prefix usage is inconsistent, raise a warning
                if (f[specialProp] !== 'both' && f[specialProp] !== newProp) {
                    // raise a warning
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    f[specialProp] = 'both';
                }
                // else do nothing
            } else {
                // define the new hidden property
                Object.defineProperty(f, specialProp, {
                    enumerable: false,
                    value: newProp
                });
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("InconsistentNewCallPrefix", iid, location, "calling constructor with/without new prefix inconsistently at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);