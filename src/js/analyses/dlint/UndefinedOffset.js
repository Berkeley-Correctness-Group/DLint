
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

// Author: Koushik Sen (ksen@cs.berkeley.edu)

/**
 * @dlintShort{Find code that attempts to access the 'undefined' property.}
 * @dlintPattern{propWrite(*,"undefined",*) ORR
 * propRead(*,"undefined",*)}
 * @dlintRule{Avoid accessing the "undefined" property.}
 * @dlintShortName{UndefinedProp}
 * @dlintGroup{TypeError}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {

    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {};
        
        function isUnusualOffset(offset) {
            return (offset === undefined) /*|| (offset === "undefined")*/ ||
                  (offset !== offset) /*|| (offset === "NaN") */;
        }

        this.getFieldPre = function(iid, base, offset) {
            if (isUnusualOffset(offset))
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
        };

        this.putFieldPre = function(iid, base, offset, val) {
            if (isUnusualOffset(offset))
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
        };


        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var details = "Accessed property 'undefined' or 'NaN' at " + location + " " + iidToCount[iid] + " time(s).";
                return new DLintWarning("UndefinedOffset", iid, location, details, iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



