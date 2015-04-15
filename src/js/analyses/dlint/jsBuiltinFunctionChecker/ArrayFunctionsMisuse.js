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
        // Array
        // Array.prototype.isArray
        // Array.prototype.concat

        // Array.prototype.every
        // Syntax: arr.every(callback[, thisArg])
        addEntry('Array.prototype.every', Array.prototype.every,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.every should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'function') {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function Array.prototype.every should be a function. \n Runtime Args: ' + argsToString(args));
                    } else if (args.length === 2) {
                        if(typeof args[1] !== 'object' && typeof args[1] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the second argument of function Array.prototype.every should be an object. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.filter
        // Syntax: arr.filter(callback[, thisArg])
        addEntry('Array.prototype.filter', Array.prototype.filter,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.filter should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'function') {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function Array.prototype.filter should be a function. \n Runtime Args: ' + argsToString(args));
                    } else if (args.length === 2) {
                        if(typeof args[1] !== 'object' && typeof args[1] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the second argument of function Array.prototype.filter should be an object. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.forEach
        // Syntax: arr.forEach(callback[, thisArg])
        addEntry('Array.prototype.forEach', Array.prototype.forEach,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.forEach should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'function') {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function Array.prototype.forEach should be a function. \n Runtime Args: ' + argsToString(args));
                    } else if (args.length === 2) {
                        if(typeof args[1] !== 'object' && typeof args[1] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the second argument of function Array.prototype.forEach should be an object. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.some
        // Syntax: arr.some(callback[, thisArg])
        addEntry('Array.prototype.some', Array.prototype.some,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.some should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'function') {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function Array.prototype.some should be a function. \n Runtime Args: ' + argsToString(args));
                    } else if (args.length === 2) {
                        if(typeof args[1] !== 'object' && typeof args[1] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the second argument of function Array.prototype.some should be an object. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.map
        // Syntax: arr.map(callback[, thisArg])
        addEntry('Array.prototype.map', Array.prototype.map,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.map should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'function') {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function Array.prototype.map should be a function. \n Runtime Args: ' + argsToString(args));
                    } else if (args.length === 2) {
                        if(typeof args[1] !== 'object' && typeof args[1] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the second argument of function Array.prototype.map should be an object. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.indexOf
        // Syntax: arr.indexOf(searchElement[, fromIndex = 0])
        addEntry('Array.prototype.map', Array.prototype.map,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.map should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'function') {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function Array.prototype.map should be a function. \n Runtime Args: ' + argsToString(args));
                    } else if (args.length === 2) {
                        if(typeof args[1] !== 'object' && typeof args[1] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the second argument of function Array.prototype.map should be an object. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.lastIndexOf
        // Syntax: arr.lastIndexOf(searchElement[, fromIndex = arr.length])
        addEntry('Array.prototype.map', Array.prototype.map,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.map should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (typeof args[0] !== 'function') {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function Array.prototype.map should be a function. \n Runtime Args: ' + argsToString(args));
                    } else if (args.length === 2) {
                        if(typeof args[1] !== 'object' && typeof args[1] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the second argument of function Array.prototype.map should be an object. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.join
        // Syntax: str = arr.join([separator = ','])
        addEntry('Array.prototype.join', Array.prototype.join,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.join should take at most one argument. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (args.length === 1) {
                        if (typeof args[0] !== 'string' && !(args[0] instanceof STRING)) {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the first argument of function Array.prototype.join should be a string. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.reduce
        // Syntax: arr.reduce(callback[, initialValue])
        addEntry('Array.prototype.reduce', Array.prototype.reduce,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.reduce should take at most two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (args.length === 1) {
                        if (typeof args[0] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the first argument of function Array.prototype.reduce should be a function. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.reduceRight
        // Syntax: arr.reduceRight(callback[, initialValue])
        addEntry('Array.prototype.reduceRight', Array.prototype.reduceRight,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Array.prototype.reduceRight should take at most two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (args.length === 1) {
                        if (typeof args[0] !== 'function') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the first argument of function Array.prototype.reduceRight should be a function. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // Array.prototype.reverse
        // Syntax: arr.reverse()

        // Array.prototype.shift
        // Syntax: arr.shift()        

        // Array.prototype.pop
        // Syntax: arr.pop()

        // Array.prototype.toLocaleString
        // Syntax: arr.toLocaleString();

        // Array.prototype.toString
        // Syntax: arr.toString()

        // Array.prototype.push
        // Syntax: arr.push(element1, ..., elementN)

        // Array.prototype.slice
        // Syntax: arr.slice([begin[, end]])

        // Array.prototype.sort
        // Syntax: arr.sort([compareFunction])

        // Array.prototype.splice
        // Syntax: array.splice(start, deleteCount[, item1[, item2[, ...]]])

        // Array.prototype.unshift
        // Syntax: arr.unshift([element1[, ...[, elementN]]])

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            checkFunction(f, arguments);
        };

        this.endExecution = function() {
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("ArrayFunctionsMisuse", iid, location,
                    "Incorrect use of Array built-in funcitons at " +
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