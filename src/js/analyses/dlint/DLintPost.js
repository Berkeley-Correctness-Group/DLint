/*
 * Copyright (c) 2015, University of California, Berkeley
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

// Author: Michael Pradel (michael@binaervarianz.de)
//         Koushik Sen (ksen@cs.berkeley.edu)
//         Liang Gong (gongliang13@cs.berkeley.edu)

(function(sandbox) {
    function DLintPost() {
        var Constants = sandbox.Constants;
        var HOP = Constants.HOP;

        this.endExecution = function() {
            try {
                var allWarnings = summarizeWarnings();

                // 1) write warnings to file
                if (sandbox.Constants.isBrowser) {
                    console.log("Sending results to jalangiFF");
                    window.$jalangiFFLogResult(JSON.stringify(allWarnings, 0, 2), true);
                } else {
                    var fs = require("fs");
                    var outFile = process.cwd() + "/analysisResults.json";
                    console.log("Writing analysis results to " + outFile);
                    fs.writeFileSync(outFile, JSON.stringify(allWarnings, 0, 2));
                }

                // 2) print warnings to console
                allWarnings.forEach(function(w) {
                    console.log("DLint warning: " + w.details);
                });
            } catch (ex) {
                if (sandbox.Constants.isBrowser) {
                    window.$jalangiFFLogResult(ex + '', 0, 2), true);
                } else {
                    var fs = require("fs");
                    var outFile = process.cwd() + "/analysisResults.json";
                    console.log("Writing analysis results to " + outFile);
                    fs.writeFileSync(outFile, ex + '');
                }
            }
        };

        function summarizeWarnings() {
            var warnings = sandbox.DLint.allWarnings;
            warnings.sort(function(a, b) {
                return b.count - a.count;
            });
            return warnings;
        }
    }

    sandbox.analysis = new DLintPost();

}(J$));