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