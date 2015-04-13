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

// Author: Liang Gong (gongliang13@cs.berkeley.edu)
// each warning is uniquely identified by <benchmark-name, file-name, iid, warning-type>
// each warning label has the following form in the ground-truth.json file:
/*
{
    "benchmark": "sunspider", 
    "filename": "3d-cube.js", 
    "iid": 12657, 
    "type": "NonNumericArrayProperty",
    "label": "bug"/"clean"/"[TBD]"/"unknown"
}
*/
// this tool will eliminate all warnings with [TBD] label in the ground-truth.json file.
(function() {
    var GROUND_TRUTH_FILENAME = './exp/ground-truth.json';
    var fs = require('fs');
    var warnings = JSON.parse(fs.readFileSync(GROUND_TRUTH_FILENAME, "utf8"));
    var warnings_new = [];
    var pruned = 0;
    var added = 0;
    for(var i=0;i<warnings.length;i++) {
        if(warnings[i].type === 'FunctionAsObject' && warnings[i].label === '[TBD]')
            continue;
        if(warnings[i].type === 'SimilarPropertyName' && warnings[i].label === '[TBD]')
            continue;
        if(warnings[i].type === 'ShadowProtoProperty' && warnings[i].label === '[TBD]')
            continue;
        if(warnings[i].type === 'FunctionCalledWithMoreArguments' && warnings[i].label === '[TBD]')
            continue;
        //warnings_new.push(warnings[i]);
        if(warnings[i].label !== '[TBD]') {
            warnings_new.push(warnings[i]);
            added++;
        } else {
            pruned++;
        }
    }
    fs.writeFileSync(GROUND_TRUTH_FILENAME, JSON.stringify(warnings_new, 0, 2));
    console.log('Retained: ' + added + '(' + (0|100*added/(added+ pruned)) + '%)');
    console.log('Prunded: ' + pruned + '(' + (0|100*pruned/(added+ pruned)) + '%)');
})();