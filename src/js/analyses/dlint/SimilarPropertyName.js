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

/**
 * @dlintShort{Find accesses of non-existing properties,
 * where a property with a similar name exists.}
 * @dlintLong{Intended to catch typos in property names.
 * Current version has many false positives; needs more work to become an effective checker.}
 * @dlintPattern(propRead(base,name,val) WHERE val = undefined AND \exists~ name'~.~base.name' \neq undefined AND similar(name,name')}
 * @dlintRule{Avoid typos when accessing properties.}
 * @dlintShortName{SimilarPropName}
 * @dlintGroup{TypeError}
 * @dlintNeedDynamic
 * @dlintSingleEventPattern
 * @dlintObsolete
 */

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var Constants = sandbox.Constants;

        var detailsToWarning = {};  // iid: string --> DLintWarning

        var minLength = 3;   // names shorter than minLength are never considered similar
        var maxDiff = 2;     // names with at en edit distance of at most maxDiff are considered similar

        function mostSimilarName(name, otherNames) {
            if (name.length >= minLength) {
                var proposedName;
                var proposedNamesDistance = Number.MAX_VALUE;
                for (var i = 0; i < otherNames.length; i++) {
                    var other = otherNames[i];
                    if (other !== name && other.length >= minLength) {
                        var distance = sandbox.levenshtein(name, other);
                        if (distance <= maxDiff && distance < proposedNamesDistance) {
                            proposedName = other;
                            proposedNamesDistance = distance;
                        }
                    }
                }
                if (proposedName)
                    return proposedName;
            }
        }

        function addWarning(iid, origName, proposedName) {
            var location = iidToLocation(iid);
            var details = "Property '" + origName + "' is undefined at " + location + ". Do you mean '" + proposedName + "'?";
            var warning = detailsToWarning[details] || new DLintWarning("SimilarPropertyName", iid, location, details, 0);
            warning.count += 1;
            detailsToWarning[details] = warning;
        }

        this.getField = function(iid, base, offset, val) {
            if (offset !== undefined && val === undefined && offset.length >= minLength) {
                var allProps = Object.keys(base);
                var otherProp = mostSimilarName(offset, allProps);
                if (otherProp) {
                    addWarning(iid, offset, otherProp);
                }
            }
        };

        this.endExecution = function() {
            var warnings = [];
            Object.keys(detailsToWarning).forEach(function(d) {
                warnings.push(detailsToWarning[d]);
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);