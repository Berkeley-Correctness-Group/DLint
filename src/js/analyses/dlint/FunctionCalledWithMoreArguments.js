
/*
 * Copyright 2014 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Koushik Sen (ksen@cs.berkeley.edu), Michael Pradel (michael@binaervarianz.de)

/**
 * @dlintShort{Find functions that are called with more arguments than expected by the function.}
 * @dlintLong{Checks for the number of formal parameters of a function and
 * for whether the function accesses the 'arguments' variable.}
 * @dlintRule{Pass at most as many arguments to a function as it expects.}
 * @dlintPattern{call(*,*,args,*,*) WHERE |args| > |\mbox{formal params. of callee}| AND \nexists~ varRead(arguments,*)~\mbox{during the call}}
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



