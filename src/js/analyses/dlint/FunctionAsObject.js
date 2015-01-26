/*
 * Copyright 2014 University of California, Berkeley
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

// Author: Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)

// NOTE: This analysis may give many false warnings. If it does, we should disable it.

/**
 * @dlintShort{Find code that uses functions as objects, i.e., code that stores properties in function objects.}
 * @dlintLong{It turns out that using functions as objects is common, so this checker results in many (false) warnings.}
 * @dlintRule{Avoid storing properties in function objects.}
 * @dlintPattern{(propRead(base,name,*) OR propWrite(base,name,*)) WHERE isFct(base) AND name \notin expectedFctProps)}
 * @dlintShortName{FunctionAsObject}
 * @dlintGroup{LanguageMisuse}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 * @dlintObsolete
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToCount = {}; // iid: number --> count: number
        var iidToInfo = {}; // iid: number --> info: object
        var Utils = sandbox.Utils;

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        this.getField = function(iid, base, offset, val) {
            if (typeof base === "function" && offset !== "prototype" &&
                typeof val !== "function" &&
                offset !== "name" && offset !== "arguments" && offset !== "caller" &&
                offset !== "length" && offset !== "displayName") {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'get field from function, offset: ' + offset);
            }
        };

        this.putField = function(iid, base, offset, val) {
            if (typeof base === "function" && offset !== "prototype" &&
                typeof val !== "function") {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'put field to function, offset: ' + offset);
            }
        };

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("FunctionAsObject", iid, location, "A function is used like an object at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);