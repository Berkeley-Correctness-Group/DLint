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

// check for the correct use of RegExp (built-in) functions in JavaScript

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var Utils = sandbox.Utils;

        var iidToCount = {}; // iid: number --> count: number
        var iidToInfo = {}; // iid: number --> info: object
        var additionalInfo = {
            hasInfo: false,
            addMsg: function(msg) {
                this.hasInfo = true;
                this[msg] = this[msg] | 0 + 1;
            }
        };

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        // ---- function DB and check API starts ----
        var functionDB = {};

        function addEntry(name, targetFunction, checkerFunction) {
            functionDB[name] = {
                target: targetFunction,
                checker: checkerFunction
            };
        }

        function checkFunction(f, args) {
            for (var prop in functionDB) {
                if (!functionDB.hasOwnProperty(prop)) continue;
                var item = functionDB[prop];
                if (item.target === f) {
                    item.checker.apply({}, args);
                }
            }
        }

        // ---- function DB and check API ends ----

        var STRING = String;
        var REGEXP = RegExp;

        function argsToString(args) {
            var ret = '[';
            var i = 0;
            for (i = 0; i < args.length - 1; i++) {
                ret += (typeof args[i]) + ',';
            }
            if (i < args.length) {
                ret += (typeof args[i]);
            }
            ret += ']';
            return ret;
        }

        // RegExp
        // Syntax:
        // /pattern/flags
        // new RegExp(pattern[, flags])
        addEntry('RegExp', REGEXP,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function RegExp should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'string' && !(args[0] instanceof STRING)) {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function RegExp should be either a string value. \n Runtime Args: ' + argsToString(args));
                    } else if (args.length === 2){
                        if(typeof args[1] !== 'string' && !(args[1] instanceof STRING)) {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the second argument of function RegExp should be a string. \n Runtime Args: ' + argsToString(args));
                        } else {
                            check_flags:
                            for(var i=0;i<args[1].length;i++) {
                                if(args[1][i] !== 'g' && args[1][i] !== 'i' && args[1][i] !== 'm') {
                                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                    addDebugInfo(iid, 'the second argument (flags) of function RegExp contain only \'g\',\'i\', or \'m\'. \n Runtime Args: ' + argsToString(args));
                                    break check_flags;
                                }
                            }
                        }
                    }
                }
            }
        );

        // RegExp.prototype.test
        // Syntax: regexObj.test(str)
        addEntry('RegExp.prototype.test', RegExp.prototype.test,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function RegExp.prototype.test should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'string' && !(args[0] instanceof STRING)) {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function RegExp should be either a string value. \n Runtime Args: ' + argsToString(args));
                    } 
                }
            }
        );

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            checkFunction(f, arguments);
        };

        this.endExecution = function() {
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("StringFunctionsMisuse", iid, location,
                    "Incorrect use of String built-in funcitons at " +
                    location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                ret.addInfo = JSON.stringify(additionalInfo);
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);