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
        var OBJECT = Object;

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
        // Object

        // Object.create
        // Syntax: Object.create(proto[, propertiesObject])
        addEntry('Object.create', Object.create,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.create should take 1~2 arguments. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.create should be an object. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isObject(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of Object.create should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );
        
        // Object.defineProperties
        // Syntax: Object.defineProperties(obj, props)
        addEntry('Object.defineProperties', Object.defineProperties,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.defineProperties should take only two arguments. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.defineProperties should be an object. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isObject(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of Object.defineProperties should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.defineProperty
        // Syntax: Object.defineProperty(obj, prop, descriptor)
        addEntry('Object.defineProperty', Object.defineProperty,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 3) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.defineProperty should take three arguments. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.defineProperty should be an object. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isString(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of Object.defineProperty should be a string. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 3 && !Utils.isObject(args[2])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the third argument of Object.defineProperty should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.freeze
        // Syntax: Object.freeze(obj)
        addEntry('Object.freeze', Object.freeze,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.freeze should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.freeze should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.getOwnPropertyDescriptor
        // Syntax: Object.getOwnPropertyDescriptor(obj, prop)
        addEntry('Object.getOwnPropertyDescriptor', Object.getOwnPropertyDescriptor,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.getOwnPropertyDescriptor should take only two arguments. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.getOwnPropertyDescriptor should be an object. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isString(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of Object.getOwnPropertyDescriptor should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.getOwnPropertyNames
        // Syntax: Object.getOwnPropertyNames(obj)
        addEntry('Object.getOwnPropertyNames', Object.getOwnPropertyNames,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.getOwnPropertyNames should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.getOwnPropertyNames should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.getPrototypeOf
        // Syntax: Object.getPrototypeOf(obj)
        addEntry('Object.getPrototypeOf', Object.getPrototypeOf,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.getPrototypeOf should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.getPrototypeOf should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.isExtensible
        // Syntax: Object.isExtensible(obj)
        addEntry('Object.isExtensible', Object.isExtensible,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.isExtensible should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.isExtensible should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.isFrozen
        // Syntax: Object.isFrozen(obj)
        addEntry('Object.isFrozen', Object.isFrozen,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.isFrozen should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.isFrozen should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.isSealed
        // Syntax: Object.isSealed(obj)
        addEntry('Object.isSealed', Object.isSealed,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.isSealed should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.isSealed should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.seal
        // Syntax: Object.seal(obj)
        addEntry('Object.seal', Object.seal,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.seal should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.seal should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );


        // Object.keys
        // Syntax: Object.keys(obj)
        addEntry('Object.keys', Object.keys,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.keys should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.keys should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.preventExtensions
        // Syntax: Object.preventExtensions(obj)
        addEntry('Object.preventExtensions', Object.preventExtensions,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.preventExtensions should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.preventExtensions should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.prototype.hasOwnProperty
        // Syntax: obj.hasOwnProperty(prop)
        addEntry('Object.prototype.hasOwnProperty', Object.prototype.hasOwnProperty,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.prototype.hasOwnProperty should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.prototype.hasOwnProperty should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.prototype.isPrototypeOf
        // Syntax: prototypeObj.isPrototypeOf(obj)
        addEntry('Object.prototype.isPrototypeOf', Object.prototype.isPrototypeOf,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.prototype.isPrototypeOfshould take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isObject(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.prototype.isPrototypeOf should be an object. \n Runtime Args: ' + argsToString(args));
                }
            }
        );


        // Object.prototype.propertyIsEnumerable
        // Syntax: obj.propertyIsEnumerable(prop)
        addEntry('Object.prototype.propertyIsEnumerable', Object.prototype.propertyIsEnumerable,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.prototype.propertyIsEnumerable should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of Object.prototype.propertyIsEnumerable should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.prototype.toLocaleString
        // Syntax: obj.toLocaleString()
        addEntry('Object.prototype.toLocaleString', Object.prototype.toLocaleString,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.prototype.toLocaleString should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // Object.prototype.toString
        // Syntax: obj.toString()
        addEntry('Object.prototype.toString', Object.prototype.toString,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.prototype.toString should not take any argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );


        // Object.prototype.valueOf
        // Syntax: object.valueOf()
        addEntry('Object.prototype.valueOf', Object.prototype.valueOf,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function Object.prototype.valueOf should not take any argument. \n Runtime Args: ' + argsToString(args));
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
                var ret = new DLintWarning("ObjectFunctionsMisuse", iid, location,
                    "Incorrect use of Object built-in funcitons at " +
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