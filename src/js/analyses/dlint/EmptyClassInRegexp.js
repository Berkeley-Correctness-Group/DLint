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
 * @dlintShort{Find empty class in regular expression.}
 * @dlintLong{
 * The following example defines a regular expression including an empty character class:
 * 
 * ```javascript
 * var r = /^abc[]/;
 * ```  
 * This error is raised to highlight code that may not work as you expect it to. 
 * According to the regular expression grammar in the ECMAScript standard, empty character 
 * classes are allowed. However, an empty character class can never match anything, meaning 
 * the regular expression in the example above will always fail to match. Since it's unlikely 
 * you intended such behaviour, a warning is raised to highlight the fact that you may have 
 * overlooked something, or simply made a small typo.
 *
 * However, static analysis may not accurately catch the following case:
 *
 * ```javascript
 * var str = "^abc[]";
 * ...
 * var r = new RegExp(str);
 * ```
 * }
 * @dlintRule{Avoid using an empty character class, \code{[]}, in regular expressions, as it does not match anything.}
 * @dlintPattern{lit(val) WHERE isRegExp(val) AND val~\mbox{contains "[]"} ORR
 * call(builtin,RegExp,args,*,*) WHERE isString(args[0]) AND args[0]~\mbox{contains "[]"}}
 * @dlintShortName{EmptyCharClass}
 * @dlintGroup{APIMisuse}
 * @dlintMayNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number
        var REGEXP_CONSTRUCTOR = RegExp;

        function checkRegExp(str, iid) {
            // search for two consecutive empty spaces
            if (str.indexOf('[]') >= 0) {
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
                return new DLintWarning("EmptyClassInRegexp", iid, location, "Constructing regular expression with empty character class at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);