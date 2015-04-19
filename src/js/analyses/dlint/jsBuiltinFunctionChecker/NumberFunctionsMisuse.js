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
        var ARRAY = Array;
        var DATE = Date;

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

        // The following functions are robust enough
        // in js engine and therefore runtime checks
        // seems unnecessary:
        // Number

        // Number.prototype.toExponential
        // Syntax: numObj.toExponential([fractionDigits])
        addEntry('Number.prototype.toExponential', Number.prototype.toExponential,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Number.prototype.toExponential should take at most one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Number.prototype.toExponential should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Number.prototype.toFixed
        // Syntax: numObj.toFixed([digits])
        addEntry('Number.prototype.toFixed', Number.prototype.toFixed,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Number.prototype.toFixed should take at most one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Number.prototype.toFixed should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Number.prototype.toLocaleString
        // Syntax: numObj.toLocaleString([locales [, options]])
        addEntry('Number.prototype.toLocaleString', Number.prototype.toLocaleString,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Number.prototype.toLocaleString should take at most two arguments. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0]) && !Utils.isStringArray(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of function Number.prototype.toLocaleString should be either a string or an array of strings. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && (typeof args[1] !== 'object')) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of function Number.prototype.toLocaleString should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Number.prototype.toPrecision
        // Syntax: numObj.toPrecision([precision])
        addEntry('Number.prototype.toPrecision', Number.prototype.toPrecision,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Number.prototype.toPrecision should take at most one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Number.prototype.toPrecision should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Number.prototype.toString
        // Syntax: numObj.toString([radix])
        addEntry('Number.prototype.toString', Number.prototype.toString,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Number.prototype.toString should take at most one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Number.prototype.toString should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Number.prototype.valueOf
        // Syntax: numObj.valueOf()
        addEntry('Number.prototype.valueOf', Number.prototype.valueOf,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Number.prototype.valueOf should not take any argument. \n Runtime Args: ' + argsToString(args));
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
                var ret = new DLintWarning("NumberFunctionsMisuse", iid, location,
                    "Incorrect use of Number built-in funcitons at " +
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