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


// Author: Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)

// patch: if an object is attached property callee, caller, or length, then it is not an arguments object.
// arguments.caller no longer exists
// should use arguments.caller.callee instead
// the following web API specification is wrong
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/caller

/**
 * @dlintShort{Find code that accesses non-existing properties of the 'arguments' variable.}
 * @dlintPattern{propRead(arguments,name,*) WHERE name \notin argumentProps ORR
 * propWrite(arguments,*,*) ORR
 * call(arguments,concat,*,*,*)}
 * @dlintRule{Avoid accessing non-existing properties of \code{arguments}.}
 * @dlintShortName{ArgumentsVariable}
 * @dlintGroup{LanguageMisuse}
 * @dlintMayNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number
        
        var NOT_ARGUMENTS_OBJECT_TAG = "$$dlint_not_arguments_object_tag$$"; // TODO: use SMemory

        function isArgumentsObject(o) {
            var ret = (o && (typeof o === "object") && o.hasOwnProperty("callee") && o.hasOwnProperty("length"));
            return ret && !o[NOT_ARGUMENTS_OBJECT_TAG];
        }

        function isArgumentsProperty(p) {
            return (typeof p === "number") || p === "callee" || p === "length";
        }

        this.getFieldPre = function(iid, base, offset) {
            // MP: Leads to false positives when code checks if 'arguments' has some other properties.
            //     E.g., underscore.js's every() checks whether an object has an 'every' property and
            //     if not, uses only properties provided by 'arguments'.
            //     --> How to avoid these false positives?
            if (isArgumentsObject(base) && !isArgumentsProperty(offset)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }

            return {
                base:base,
                offset:offset,
                skip:false
            };
        };

        this.putFieldPre = function(iid, base, offset, val) {
            if (isArgumentsObject(base)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            } else {
                if (typeof base === 'object' || typeof base === 'function') {
                    // if callee, caller, length property is added by user's code
                    if (offset === 'callee' || offset === 'length') {
                        if (!Object.hasOwnProperty(base)) {
                            // consider it not an arguments object
                            Object.defineProperty(base, NOT_ARGUMENTS_OBJECT_TAG, {
                                enumerable:false,
                                configurable:false,
                                writable:false,
                                value:true
                            });
                        }
                    }
                }
            }

            return {
                base:base,
                offset:offset,
                val:val,
                skip:false
            };
        };

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            if (f === Array.prototype.concat && args.length > 0 && isArgumentsObject(args[0])) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("IllegalUseOfArgumentsVariable", iid, location, "Illegal use of 'arguments' at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);