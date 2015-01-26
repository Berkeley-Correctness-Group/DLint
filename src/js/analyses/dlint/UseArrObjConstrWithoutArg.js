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
 * @dlintShort{Find use of ```Array``` and ```Object``` constructor without parameter}
 * @dlintLong{
 * Try to use Array literal whenever possible
 * Generate a warning when encounter a call to the Array constructor 
 * preceded by the new operator with no arguments or more than one 
 * argument or a single argument that is not a number.
 * 
 * For example:
 * ```javascript  
 * var arr = new Array(); // generate warning
 * var arr2 = new Array(10); // no warning
 * ```  
 * Static analysis can not easily catch the following case:
 * ```javascript  
 * var ARRAY_ORIG = Array;
 * ...
 * var arr = new ARRAY_ORIG();
 * ```
 * Similarly, the object literal notation {} is preferable error (and the
 * alternative Use the object literal notation {} and Use the object 
 * literal notation {} or Object.create(null) error) are thrown when 
 * JSLint, JSHint and ESLint encounter a call to the Object constructor 
 * preceded by the new operator.
 * 
 * For example:
 * ```javascript
 * // this leads to a warning
 * var x = new Object();
 * ```
 * Similar to the previous rule, this cannot be accurately caught by 
 * static analysis due to the limitation of alias analysis.
 * }
 * @dlintRule{Use literals instead of \code{new Object()} and \code{new Array()}\tnote{Note that it is legitimate for performance reasons to call these constructors with arguments~\cite{jitprof_tr_aug3_2014}.}}
 * @dlintPattern{call(builtin,f,args,*,*) WHERE (isArray(f) OR isObject(f)) AND args.length = 0}
 * @dlintShortName{Literals}
 * @dlintGroup{LanguageMisuse}
 * @dlintMayNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number
        var ARRAY_CONSTRUCTOR = Array;
        var OBJECT_CONSTRUCTOR = Object;


        // check the 'new RegExp(str)' and 'RegExp(str)' case
        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            if (f === ARRAY_CONSTRUCTOR || f === OBJECT_CONSTRUCTOR) {
                if (args.length === 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                }
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("UseArrObjConstrWithoutArg", iid, location, 
                    "Use Array or Object constructor without arguments at " + 
                    location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);