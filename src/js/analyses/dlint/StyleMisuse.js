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

// Author: Liang Gong (gongliang13@cs.berkeley.edu)

/**
 * @dlintShort{Find code that compares a CSS object with a string.}
 * @dlintLong{Even though style attributes can be set as a string in HTML,
 * this comparison is meaningless in JavaScript because the 'style' property
 * is not a string and does not provide a toString() method.}
 * @dlintPattern{binOp(eqOp,left,right) WHERE isCSSObj(left) AND isString(right) ORR
 * binOp(eqOp,left,right) WHERE isString(left) AND isCSSObj(right)}
 * @dlintRule{CSS objects are not strings and should not be used as if they were.}
 * @dlintShortName{StyleMisuse}
 * @dlintGroup{APIMisuse}
 * @dlintMayNeedDynamic
 * @dlintSingleEventPattern
 */

((function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var cssConstructor;
        var regexp = /([^\d])+/g;
        var RuntimeDB = sandbox.RuntimeDB;
        var db = new RuntimeDB();
        var iidsWithNonCSSObjectComparison = {};

        function loadCssConstructor() {
            if (typeof document === 'undefined') {
                document = sandbox.document;
            }
            cssConstructor = document.createElement('div').style.constructor;
        }

        this.binary = function(iid, op, left, right, result_c) {
            if (typeof cssConstructor === 'undefined') {
                loadCssConstructor();
            }

            if (op === '===' || op === '!==' || op === '==' || op === '!=') {
                if (!(left instanceof cssConstructor || right instanceof  cssConstructor)) {
                    iidsWithNonCSSObjectComparison[iid] = true;
                }
            }

            if (left instanceof cssConstructor || right instanceof cssConstructor) {
                if (op === '===' || op === '!==' || op === '==' || op === '!=') {
                    if ((typeof left === 'string' && right instanceof cssConstructor) || (typeof right === 'string' && left instanceof cssConstructor)) {
                        var localdb = db.getByIndexArr(['Dlint', 'style-misuse', iid]);
                        var index = left + ' ' + op + ' ' + right;
                        if (!localdb) {
                            localdb = {};
                            db.setByIndexArr(['Dlint', 'style-misuse', iid], localdb);
                        }
                        if (localdb[index]) {
                            localdb[index].count++;
                        } else {
                            localdb[index] = {
                                left: left,
                                op: op,
                                right: right,
                                count: 1
                            };
                        }
                    }
                }
            }
        };

        /*
         this.putFieldPre = function (iid, base, offset, val) {
         if(base instanceof cssConstructor && (offset === 'width' || offset === 'height')) {
         // if the value is just a number or a string represents a pure number
         if(typeof val ==='number' || (typeof val === 'string' && val.match(regexp)!== null)) {
         console.log('[iid: ' + JSON.stringify(iidToLocation(iid)) + ']: setting a number ' + 
         val + ' to style.' + offset + ' without unit is not safe across browsers.');
         }
         }
         return val;
         };
         */

        this.endExecution = function() {
            var innerdb = db.getByIndexArr(['Dlint', 'style-misuse']);
            var cont = 0;
            if (!innerdb)
                innerdb = {};
            var warnings = Object.keys(innerdb).filter(function(iid) {
                // to avoid false positives due to generic code that compares arbitrary values,
                // don't report a warning if the location compares values other than CSS properties
                return !iidsWithNonCSSObjectComparison.hasOwnProperty(iid);
            }).map(function(iid) {
                var warningMsg = "Observed style misuse at " + iidToLocation(iid) + ":\n\t";
                warningMsg += Object.keys(innerdb[iid]).map(function(index) {
                    var dbObj = innerdb[iid][index];
                    cont += dbObj.count;
                    return dbObj.left + ' ' + dbObj.op + ' ' + dbObj.right;
                }).join('\n\t');
                var location = iidToLocation(iid);
                return new DLintWarning("StyleMisuse", iid, location, warningMsg, cont);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$));