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

// Author: Koushik Sen (ksen@cs.berkeley.edu), Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)
//

/**
 * @dlintShort{Find writes of an object property that shadows a prototype property.}
 * @dlintLong{To reduce false warnings, ignore it if the base object of the put property
 * operation is a DOM HTML element.}
 * @dlintPattern{propWrite(base,name,val) WHERE val~\mbox{is defined in}~ base's ~\mbox{prototype chain} AND !isFct(val) AND (base,name) \notin shadowingAllowed}
 * @dlintRule{Avoid shadowing a prototype property with an object property.}
 * @dlintShortName{ShadowProtoProp}
 * @dlintGroup{Inheritance}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var Constants = sandbox.Constants;
        var HOP = Constants.HOP;
        var DLintWarning = sandbox.DLint.DLintWarning;

        var iidToOffsetToCount = {}; // number --> string --> number
        var iidToInfo = {}; // iid: number --> info: object
        var Utils = sandbox.Utils;

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        this.putFieldPre = function(iid, base, offset, val) {
            if (Utils.isHTMLElement(base)) {
                return;
            } else if (Utils.isCSSElement(base)) {
                return;
            } else if (offset === 'withCredentials' && base && base.constructor && base.constructor.toString().indexOf('function XMLHttpRequest()') >= 0) {
                return;
            }
            if (typeof val !== 'function' && base && !HOP(base, offset)) {
                var tmp = base.__proto__;
                while (tmp) {
                    if (HOP(tmp, offset)) {
                        if (!iidToOffsetToCount[iid]) {
                            iidToOffsetToCount[iid] = {};
                        }
                        iidToOffsetToCount[iid][offset] = (iidToOffsetToCount[iid][offset] | 0) + 1;
                        addDebugInfo(iid, 'base constructor: ' + Utils.getConstructorName(base) + ' | offset: ' + offset);
                        return;
                    }
                    tmp = tmp.__proto__;
                }
            }
        };

        this.endExecution = function() {
            //reorganize iidToInfo
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = [];
            for (var iid in iidToOffsetToCount) {
                if (HOP(iidToOffsetToCount, iid)) {
                    var offsets = iidToOffsetToCount[iid];
                    for (var offset in offsets) {
                        if (HOP(offsets, offset)) {
                            var location = iidToLocation(iid);
                            var count = offsets[offset];
                            var details = "Written property " + offset + " at " + location + " " + count + " time(s) and it shadows the property in its prototype.";
                            var warning = new DLintWarning("ShadowProtoProperty", iid, location, details, count);
                            warning.debugInfo = iidToInfo[iid];
                            warnings.push(warning);
                        }
                    }
                }
            }
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);