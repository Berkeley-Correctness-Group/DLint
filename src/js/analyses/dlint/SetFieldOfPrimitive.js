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
 * @dlintShort{Find code that attempts to write a property of a primitive value.}
 * @dlintLong{Such code will succeed because the primitive is coerced into an object,
 * but the write is meaningless as it doesn't modify the primitive.}
 * @dlintPattern(propWrite(base,*,*) WHERE isPrim(base)}
 * @dlintRule{Avoid setting properties of primitives, which has no effect.}
 * @dlintShortName{PropOfPrimitive}
 * @dlintGroup{LanguageMisuse}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

((function (sandbox) {
	function MyAnalysis() {

		var iidToCount = {};  // iid: number --> count: number
		var iidToLocation = sandbox.iidToLocation;
		var DLintWarning = sandbox.DLint.DLintWarning;

	    this.putFieldPre = function(iid, base, offset, val) {
	      if (typeof base === 'boolean' || typeof base === 'number' || typeof base === 'string') {
	        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
	      }
	    };

    	this.endExecution = function() {
    		console.log(JSON.stringify(iidToCount));
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("SetFieldOfPrimitive", iid, location, "Observed set field to primitive at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                return ret;
            });
            //console.log(JSON.stringify(warnings));
            sandbox.DLint.addWarnings(warnings);
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$));