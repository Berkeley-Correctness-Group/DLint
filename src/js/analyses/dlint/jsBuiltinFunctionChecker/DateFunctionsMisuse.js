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

        // Date.UTC
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

        // Date.parse
        // Syntax: Date.parse(dateString)
        addEntry('Date.parse', Date.parse,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.parse should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else {
                    if(!Utils.isString(args[0])) {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function Date.parse should be a string. \n Runtime Args: ' + argsToString(args));
                    }
                }
            }
        );

        // Date.now
        // Syntax: var timeInMs = Date.now();
        addEntry('Date.now', Date.now,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.now should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getDate
        // Syntax: dateObj.getDate()
        addEntry('Date.prototype.getDate', Date.prototype.getDate,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getDate should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getDay
        // Syntax: dateObj.getDay()
        addEntry('Date.prototype.getDay', Date.prototype.getDay,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getDay should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getFullYear
        // Syntax: dateObj.getFullYear()
        addEntry('Date.prototype.getFullYear', Date.prototype.getFullYear,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getFullYear should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getHours
        // Syntax: dateObj.getHours()
        addEntry('Date.prototype.getHours', Date.prototype.getHours,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getHours should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getMilliseconds
        // Syntax: dateObj.getMilliseconds()
        addEntry('Date.prototype.getMilliseconds', Date.prototype.getMilliseconds,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getMilliseconds should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getMinutes
        // Syntax: dateObj.getMinutes()
        addEntry('Date.prototype.getMinutes', Date.prototype.getMinutes,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getMinutes should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getMonth
        // Syntax: dateObj.getMonth()
        addEntry('Date.prototype.getMonth', Date.prototype.getMonth,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getMonth should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getSeconds
        // Syntax: dateObj.getSeconds
        addEntry('Date.prototype.getSeconds', Date.prototype.getSeconds,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getSeconds should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getTime
        // Syntax: dateObj.getTime()
        addEntry('Date.prototype.getTime', Date.prototype.getTime,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getTime should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getTimezoneOffset
        // Syntax: dateObj.getTimezoneOffset()
        addEntry('Date.prototype.getTimezoneOffset', Date.prototype.getTimezoneOffset,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getTimezoneOffset should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );


        // Date.prototype.getUTCDate
        // Syntax: dateObj.getUTCDate()
        addEntry('Date.prototype.getUTCDate', Date.prototype.getUTCDate,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getUTCDate should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getUTCDay
        // Syntax: dateObj.getUTCDay()
        addEntry('Date.prototype.getUTCDay', Date.prototype.getUTCDay,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getUTCDay should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getUTCFullYear
        // Syntax: dateObj.getUTCFullYear()
        addEntry('Date.prototype.getUTCFullYear', Date.prototype.getUTCFullYear,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getUTCFullYear should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getUTCHours
        // Syntax: dateObj.getUTCHours()
        addEntry('Date.prototype.getUTCHours', Date.prototype.getUTCHours,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getUTCHours should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getUTCMilliseconds
        // Syntax: dateObj.getUTCMilliseconds()
        addEntry('Date.prototype.getUTCMilliseconds', Date.prototype.getUTCMilliseconds,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getUTCMilliseconds should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getUTCMinutes
        // Syntax: dateObj.getUTCMinutes()
        addEntry('Date.prototype.getUTCMinutes', Date.prototype.getUTCMinutes,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getUTCMinutes should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getUTCMonth
        // Syntax: dateObj.getUTCMonth()
        addEntry('Date.prototype.getUTCMonth', Date.prototype.getUTCMonth,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getUTCMonth should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.getUTCSeconds
        // Syntax: dateObj.getUTCSeconds()
        addEntry('Date.prototype.getUTCSeconds', Date.prototype.getUTCSeconds,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.getUTCSeconds should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.setDate()
        // Syntax: dateObj.setDate(dayValue)
        addEntry('Date.prototype.setDate', Date.prototype.setDate,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.setDate should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (!Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Date.prototype.setDate should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.setFullYear()
        // Syntax: dateObj.setFullYear(yearValue[, monthValue[, dayValue]])
        addEntry('Date.prototype.setFullYear', Date.prototype.setFullYear,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 3) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.setFullYear should take only 1~3 arguments. \n Runtime Args: ' + argsToString(args));
                } else if (!Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Date.prototype.setFullYear should be an integer. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isInteger(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of Date.prototype.setFullYear should be an integer. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 3 && !Utils.isInteger(args[2])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the third argument of Date.prototype.setFullYear should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.setHours()
        // Syntax: dateObj.setHours(hoursValue[, minutesValue[, secondsValue[, msValue]]])
        addEntry('Date.prototype.setHours', Date.prototype.setHours,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 4) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.setHours should take only 1~4 arguments. \n Runtime Args: ' + argsToString(args));
                } else if (!Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Date.prototype.setHours should be an integer. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isInteger(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of Date.prototype.setHours should be an integer. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 3 && !Utils.isInteger(args[2])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the third argument of Date.prototype.setHours should be an integer. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 4 && !Utils.isInteger(args[3])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the fourth argument of Date.prototype.setHours should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.setMilliseconds()
        // Syntax: dateObj.setMilliseconds(millisecondsValue)
        addEntry('Date.prototype.setMilliseconds', Date.prototype.setMilliseconds,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.setMilliseconds should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (!Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Date.prototype.setMilliseconds should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.setMinutes()
        // Syntax: dateObj.setMinutes(minutesValue[, secondsValue[, msValue]])
        addEntry('Date.prototype.setMinutes', Date.prototype.setMinutes,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 3) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.setMinutes should take only 1~3 arguments. \n Runtime Args: ' + argsToString(args));
                } else if (!Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Date.prototype.setMinutes should be an integer. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isInteger(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of Date.prototype.setMinutes should be an integer. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 3 && !Utils.isInteger(args[2])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the third argument of Date.prototype.setMinutes should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Date.prototype.setMonth()
        // Syntax: dateObj.setMonth(monthValue[, dayValue])
        addEntry('Date.prototype.setMonth', Date.prototype.setMonth,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Date.prototype.setMonth should take only 1~2 arguments. \n Runtime Args: ' + argsToString(args));
                } else if (!Utils.isInteger(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Date.prototype.setMonth should be an integer. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isInteger(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of Date.prototype.setMonth should be an integer. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

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