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

// Author: Koushik Sen (ksen@cs.berkeley.edu), Michael Pradel (michael@binaervarianz.de)

/**
 * @dlintShort{Find functions that are called with more arguments than expected by the function.}
 * @dlintLong{Checks for the number of formal parameters of a function and
 * for whether the function accesses the 'arguments' variable.}
 * @dlintRule{Pass at most as many arguments to a function as it expects.}
 * @dlintPattern{call(*,f,args,*,*) WHERE |args| > f.length AND \nexists~ varRead(arguments,*)~\mbox{during the call}}
 * @dlintShortName{TooManyArguments}
 * @dlintGroup{TypeError}
 * @dlintNeedDynamic
 * @dlintMultiEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var smemory = sandbox.smemory;
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        function isNative(f) {
            return f.toString().indexOf('[native code]') > -1 || f.toString().indexOf('[object ') === 0;
        }

        var iidToCount = {};

        var READS_ARGUMENTS = 1;
        var DOESNT_READ_ARGUMENTS = 2;
        var HAVE_INSTRUMENTED_TAG = "dlint_have_instrumented";  // TODO: should use SMemory

        var stack = [];

        this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod) {
            stack.push(DOESNT_READ_ARGUMENTS);
        };

        this.functionEnter = function(iid, f, dis, args) {
            f[HAVE_INSTRUMENTED_TAG] = true;
        };

        this.read = function(iid, name, val, isGlobal, isPseudoGlobal) {
            if (stack.length > 0 && name === "arguments") {
                stack[stack.length - 1] = READS_ARGUMENTS;
            }
        };

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            if (stack.length > 0) {
                if (stack[stack.length - 1] === DOESNT_READ_ARGUMENTS &&
                      f[HAVE_INSTRUMENTED_TAG] === true &&
                      f.length < args.length && !isNative(f)) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                }
                stack.pop();
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var details = "Function at " + location + " called " + iidToCount[iid] + " time(s) with more arguments than expected.";
                return new DLintWarning("FunctionCalledWithMoreArguments", iid, location, details, iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



