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

(function(sandbox) {
    function DLint() {
        this.allWarnings = [];
    }

    DLint.prototype.addWarnings = function(warnings) {
        for (var i = 0; i < warnings.length; i++) {
            this.allWarnings.push(warnings[i]);
        }
    };

    function DLintWarning(analysis, iid, locationString, details, count) {
        this.analysis = analysis;
        this.iid = iid;
        this.locationString = locationString;
        this.details = details;
        this.count = count;
    }

    /*
    if (sandbox.Constants.isBrowser) {
        window.addEventListener("DOMContentLoaded", function() {
            var p = window.document.createElement("p");
            p.className = "jalangiFF-p";
            p.innerHTML = "jalangiFF running...";
            window.document.body.appendChild(p);
            p.addEventListener("click", function() {
                console.log("click on jalangiFF's p element --> logging results");
                sandbox.analysis.endExecution();
            }, false);
        });
    }
    */
    
    sandbox.DLint = new DLint();
    sandbox.DLint.DLintWarning = DLintWarning;

}(J$));