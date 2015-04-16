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

        // Date
        // Syntax:
        /*
            new Date();
            new Date(value);
            new Date(dateString);
            new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
        */
        addEntry('Date', DATE,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 7) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date should take at most seven arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (args.length === 1) {
                        // console.log('!!!!' + !Utils.isString(args[0]));
                        if ((!Utils.isInteger(args[0])) && (!Utils.isString(args[0]))) {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'if taking only one argument, the first argument should be either an integer (representing the time ticks, or a string representation of the date). \n Runtime Args: ' + argsToString(args));
                        }
                    } else if (args.length >= 2) {
                        // all arguments must be integers
                        check_args_integer: for (var i = 0; i < args.length; i++) {
                            if (!Utils.isInteger(args[i])) {
                                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                addDebugInfo(iid, 'if taking multiple arguments, all arguments of Date must be integers (the ' + i + '-th argument is not an integer). \n Runtime Args: ' + argsToString(args));
                                break check_args_integer;
                            }
                        }
                    }
                }
            }
        );

        // Date.UTC()
        // Syntax: Date.UTC(year, month[, day[, hour[, minute[, second[, millisecond]]]]])
        addEntry('Date.UTC', Date.UTC,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 2 || args.length > 7) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.UTC should take 2~7 arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    // all arguments must be integers
                    check_args_integer: for (var i = 0; i < args.length; i++) {
                        if (!Utils.isInteger(args[i])) {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'if taking multiple arguments, all arguments of Date.UTC must be integers (the ' + i + '-th argument is not an integer). \n Runtime Args: ' + argsToString(args));
                            break check_args_integer;
                        }
                    }
                }
            }
        );


        // Date.now()
        // Syntax: var timeInMs = Date.now();

        // Date.parse()
        // Date.prototype.getDate()
        // Date.prototype.getDay()
        // Date.prototype.getFullYear()
        // Date.prototype.getHours()
        // Date.prototype.getMilliseconds()
        // Date.prototype.getMinutes()
        // Date.prototype.getMonth()
        // Date.prototype.getSeconds()
        // Date.prototype.getTime()
        // Date.prototype.getTimezoneOffset()
        // Date.prototype.getUTCDate()
        // Date.prototype.getUTCDay()
        // Date.prototype.getUTCFullYear()
        // Date.prototype.getUTCHours()
        // Date.prototype.getUTCMilliseconds()
        // Date.prototype.getUTCMinutes()
        // Date.prototype.getUTCMonth()
        // Date.prototype.getUTCSeconds()
        // Date.prototype.setDate()
        // Date.prototype.setFullYear()
        // Date.prototype.setHours()
        // Date.prototype.setMilliseconds()
        // Date.prototype.setMinutes()
        // Date.prototype.setMonth()
        // Date.prototype.setSeconds()
        // Date.prototype.setTime()
        // Date.prototype.setUTCDate()
        // Date.prototype.setUTCFullYear()
        // Date.prototype.setUTCHours()
        // Date.prototype.setUTCMilliseconds()
        // Date.prototype.setUTCMinutes()
        // Date.prototype.setUTCMonth()
        // Date.prototype.setUTCSeconds()
        // Date.prototype.toDateString()
        // Date.prototype.toISOString()
        // Date.prototype.toJSON()
        // Date.prototype.toLocaleDateString()
        // Date.prototype.toLocaleString()
        // Date.prototype.toLocaleTimeString()
        // Date.prototype.toString()
        // Date.prototype.toTimeString()
        // Date.prototype.toUTCString()
        // Date.prototype.valueOf()

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            checkFunction(f, arguments);
        };

        this.endExecution = function() {
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("DateFunctionsMisuse", iid, location,
                    "Incorrect use of Date built-in funcitons at " +
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