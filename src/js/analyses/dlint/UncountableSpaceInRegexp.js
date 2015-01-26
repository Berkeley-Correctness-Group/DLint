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
 * @dlintShort{Find multiple empty spaces in a regular expression string,
 * which makes the code hard to read.}
 * @dlintLong{It raises a warning when a regular expression literal
 *   contains two or more consecutive space characters.}
 * @dlintPattern{(lit(val) OR call(*,RegExp,*,*,*)) WHERE isRegExp(val) AND val~\mbox{contains "~ ~"}}
 * @dlintRule{Prefer "\code{ \{N\}}"2 over multiple consecutive empty spaces in regular expressions for readability.}
 * @dlintShortName{SpacesInRegexp}
 * @dlintGroup{APIMisuse}
 * @dlintMayNeedDynamic
 * @dlintSingleEventPattern
 */

/*  Examples:
 *  ```javascript
 *  // not sure how many spaces are there in the following code:
 *  var regex = /^three   spaces$/;
 *  // should be refactored into the following code:
 *  var regex = /^three {3}spaces$/;
 *  ```
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number
        var REGEXP_CONSTRUCTOR = RegExp;

        function checkRegExp(str, iid) {
            // search for two consecutive empty spaces
            if (str.indexOf('  ') >= 0) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        }

        // check the 'new RegExp(str)' and 'RegExp(str)' case
        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            if (f === REGEXP_CONSTRUCTOR) {
                if (typeof args[0] === 'string') {
                    checkRegExp(args[0], iid);
                }
            }
        };

        // check the regular expression literal case, e.g., /abc/
        this.literal = function(iid, val, hasGetterSetter) {
            if (val && typeof val === 'object' && val.constructor === REGEXP_CONSTRUCTOR) {
                checkRegExp(val + '', iid);
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("UncountableSpaceInRegexp", iid, location, "Constructing regular expression with empty classes at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);