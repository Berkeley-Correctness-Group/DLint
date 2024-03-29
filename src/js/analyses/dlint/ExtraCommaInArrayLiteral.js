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

// Author: Liang Gong (gongliang13@cs.berkeley.edu), Michael Pradel (michael@binaervarianz.de)

/**
 * @dlintShort{Finds extra commas in array literals.}
 * @dlintCanCheckStatically
 * @dlintObsolete
 */

/*
 See the following examples:

 Internet Explorer 7

 var opts = { minDate: -20, showWeek: true, } // Error
 var numbers = [1, 2, 3, ]; // Error

 Internet Explorer 8

 var opts = { minDate: -20, showWeek: true, } // Works
 var numbers = [1, 2, 3, ]; // length 4

 Internet Explorer 9

 var opts = { minDate: -20, showWeek: true, } // Works
 var numbers = [1, 2, 3, ]; // length 3
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var utils = sandbox.Utils;

        var iidToCount = {};  // iid: number --> count: number

        function checkArrayLiteral(arr) {
            if (!(arr && utils.isArr(arr))) {
                return false;
            }
            for (var i = 0; i < arr.length; i++) {
                if (!arr.hasOwnProperty(i)) {
                    return true;
                }
            }
            return false;
        }

        this.literal = function(iid, val, hasGetterSetter) {
            if (checkArrayLiteral(val)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("ExtraCommaInArrayLiteral", iid, location, "Undefined value in array literal at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



