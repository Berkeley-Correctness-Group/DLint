/*
 * Copyright (c) 2015, University of California, Berkeley and TU Darmstadt
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