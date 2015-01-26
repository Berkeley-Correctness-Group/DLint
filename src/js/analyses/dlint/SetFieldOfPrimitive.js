/*
 * Copyright 2014 University of California, Berkeley.
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