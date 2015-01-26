/*
 * Copyright 2014 University of California, Berkeley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong (gongliang13@cs.berkeley.edu)

/**
 * @dlintShort{Find calls of eval() and its evil twins.}
 * @dlintLong{Warns about:
 *
 * * direct and indirect call of 'eval' function
 * * call of 'Function' function
 * * call of 'document.write': document.write can be a form of eval
 * * pass to 'setTimeout' or 'setInterval' a string instead of a function
 * (this is another form of calling eval).}
 * @dlintPattern{call(builtin,eval,*,*,*) ORR
 * call(builtin,Function,*,*,*) ORR
 * call(builtin,setTimeout,args,*,*) WHERE isString(args[0]) ORR
 * call(builtin,setInterval,args,*,*) WHERE isString(args[0]) ORR
 * call(document,write,*,*,*)}
 * @dlintRule{Avoid \code{eval} and other ways of runtime code injection.}
 * @dlintShortName{DoubleEvaluation}
 * @dlintGroup{APIMisuse}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 */

// eval checker
// this checker checks the following form of eval:
//

(function(sandbox) {
  function MyAnalysis() {
    var iidToLocation = sandbox.iidToLocation;
    var DLintWarning = sandbox.DLint.DLintWarning;

    var forbNameList = ['direct or indirect eval', 'setInterval with code string', 'setTimeout with code string', 'Function', 'document.write'];
    var SET_INTERVAL = setInterval;
    var SET_TIMEOUT = setTimeout;
    var FUNCTION = Function;
    var EVAL = eval;
    var DOC_WRITE;
    var STRING = String;
    if (typeof document !== 'undefined' && document.write) {
      DOC_WRITE = document.write;
    }

    var iidToCount = {}; // iid: number --> count: number

    this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
      if (f === EVAL) { // jalangi only faciliates this to check indirect call of eval
        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
      } else if (f === FUNCTION) {
        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
      } else if (f === SET_TIMEOUT || f === SET_INTERVAL) {
        if (typeof args[0] === 'string') {
          iidToCount[iid] = (iidToCount[iid] | 0) + 1;
        } else if (args[0] && args[0].constructor === STRING) {
          iidToCount[iid] = (iidToCount[iid] | 0) + 1;
        }
      } else if (DOC_WRITE && f === DOC_WRITE) {
        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
      }
    };

    this.instrumentCode = function (iid, ast) {
      // this checks the direct call of eval
      iidToCount[iid] = (iidToCount[iid] | 0) + 1;
    };

    this.endExecution = function() {
      var warnings = Object.keys(iidToCount).map(function(iid) {
        var location = iidToLocation(iid);
        return new DLintWarning("DoubleEvaluation", iid, location, "Call eval in the form of " + forbNameList.join(' or ') + " at " + location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
      });
      sandbox.DLint.addWarnings(warnings);
    };
  }
  sandbox.analysis = new MyAnalysis();
})(J$);