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

// Author: Liang Gong (gongliang13@cs.berkeley.edu), Michael Pradel (michael@binaervarianz.de)

/**
 * @dlintShort{Finds extra commas in array literals.}
 * @dlintCanCheckStatically
 * @dlintObsolete
 */

/*
 See the following examples:

 Internet Explorer 7

 var opts = { minDate: -20, showWeek: true, } // Error
 var numbers = [1, 2, 3, ]; // Error

 Internet Explorer 8

 var opts = { minDate: -20, showWeek: true, } // Works
 var numbers = [1, 2, 3, ]; // length 4

 Internet Explorer 9

 var opts = { minDate: -20, showWeek: true, } // Works
 var numbers = [1, 2, 3, ]; // length 3
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var utils = sandbox.Utils;

        var iidToCount = {};  // iid: number --> count: number

        function checkArrayLiteral(arr) {
            if (!(arr && utils.isArr(arr))) {
                return false;
            }
            for (var i = 0; i < arr.length; i++) {
                if (!arr.hasOwnProperty(i)) {
                    return true;
                }
            }
            return false;
        }

        this.literal = function(iid, val, hasGetterSetter) {
            if (checkArrayLiteral(val)) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
            }
        };

        this.endExecution = function() {
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                return new DLintWarning("ExtraCommaInArrayLiteral", iid, location, "Undefined value in array literal at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



