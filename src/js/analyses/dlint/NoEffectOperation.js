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
 * @dlintShort{Find property writes that have no effect.}
 * @dlintLong{Excludes the following situations:
 *
 *  * set property to primitive values (checked by another checker)
 *  * set NaN as property value, as NaN !== NaN
 *  * set property to CSS objects, as the browser engine will automatically reformat the content
 *  }
 *  @dlintPattern{propWrite(base,name,val) WHERE base.name \neq val~\mbox{after the write}}
 *  @dlintRule{Writing a property should change the property's value.}
 *  @dlintShortName{FutileWrite}
 *  @dlintGroup{APIMisuse}
 *  @dlintNeedDynamic
 *  @dlintSingleEventPattern
 */


((function(sandbox) {
	function MyAnalysis() {

		var iidToCount = {}; // iid: number --> count: number
		var iidToInfo = {}; // iid: number --> info: object
		var iidToLocation = sandbox.iidToLocation;
		var DLintWarning = sandbox.DLint.DLintWarning;
		var Utils = sandbox.Utils;

		var origVal;
		this.putFieldPre = function(iid, base, offset, val) {
			if (base) {
				origVal = base[offset];
			}
		};

		function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

		// if setting property of an object has no actual effect, then report a bug.
		this.putField = function(iid, base, offset, val) {
			if (base && base[offset] !== val && !Utils.ISNAN(val)) {
				if (typeof base === 'number' ||
					typeof base === 'boolean' ||
					typeof base === 'string') {
					return;
				}

				if (base && base.constructor && (base.constructor.name === '' || typeof base.constructor.name === 'undefined')) {
					var str = base.constructor.toString();
					// location object, e.g., location.hash = 'test' -> location.hash is '#test'
					if (str.indexOf('Location') >= 0) {
						return;
					}
					// HTML DOM elements
					if (str.indexOf('HTML') >= 0 || str.indexOf('Element') >= 0) {
						return;
					}
					// CSS objects
					if (str.indexOf('css') >= 0 || str.indexOf('CSS') >= 0) {
						return;
					}
					// CanvasRenderingContext2D
					if (str.indexOf('CanvasRenderingContext2D') >=0 ) {
						return;
					}
				}

				if (offset === 'href') {
					return;
				}

				var shouldWarn = false;
				// if original value is NaN now the value is still NaN
				if (Utils.ISNAN(origVal) && Utils.ISNAN(base[offset])) {
					if (Utils.ISNAN(val)) {
						return;
					} else {
						shouldWarn = true;
					}
				} else if (origVal === base[offset] && origVal !== val) {
					shouldWarn = true;
				}

				if (shouldWarn) {
					iidToCount[iid] = (iidToCount[iid] | 0) + 1;
					var info = '[warning]: setting property \"' + offset + '\" of a base entity (type ' + typeof base + ' | constructor: ' + base.constructor.toString() + ') with value ' + val + ' does not work.\r\n origVal: ' + origVal + ' | obtainVal: ' + base[offset] + ' | intended val: ' + val;
					if (!iidToInfo[iid]) {
						iidToInfo[iid] = {};
					}
					iidToInfo[iid][info] = (iidToInfo[iid][info] | 0) + 1;
				}
			}
		};

		this.endExecution = function() {
			//console.log(JSON.stringify(iidToCount));
			//reorganize iidToInfo
			iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
			var warnings = Object.keys(iidToCount).map(function(iid) {
				var location = iidToLocation(iid);
				var ret = new DLintWarning("NoEffectOperation", iid, location, "Observed no effect operation " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
				ret.debugInfo = iidToInfo[iid];
				return ret;
			});
			//console.log(JSON.stringify(warnings));
			sandbox.DLint.addWarnings(warnings);
		};
	}

	sandbox.analysis = new MyAnalysis();
})(J$));

