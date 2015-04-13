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
// this experimental framework will:
// 1) collect all experimental result data "analysisResults.json"
// 2) collect warning labels from the ground-truth.json
// 3) compare experimental result with ground truth
// 4) report TP, TN, FP, FN rate
// 5) report number of warnings reported by each checker
// 6) generate a table and save it into a CSV file.

(function() {
    var GROUND_TRUTH_FILENAME = './exp/ground-truth.json';
    var EXP_RESULT_DIR = '.';
                         //'/Users/jacksongl/Dropbox';
                         //'/Users/jacksongl/Box Sync';
    var ANALYSIS_RES_JSON = 'analysisResults.json';
    //var benchmarks = [/*'websites-top10',*/ 'websites', 'websites-d3.js', 'webapps', 'octane', 'sunspider'];
    var benchmarks = ['websites'];
    var fs = require('fs');
    var groundTruth = JSON.parse(fs.readFileSync(GROUND_TRUTH_FILENAME, "utf8"));
    var stat = {};
    var i, j, dir;
    var analysisDB = {};
    var set = {};
    // if the number of warnings exceed this number, consider
    // the warnings ineffective on this website
    var warningThreshold = 5;

    var checkerName2AnalysisStr = {
        "CheckNaN.js": "CheckNaN",
        "ConcatUndefinedToString.js": "ConcatUndefinedToString",
        "NonObjectPrototype.js": "NonObjectPrototype",
        "OverFlowUnderFlow.js": "CheckOverflow",
        "OverwriteBuiltinVariable.js": "WriteArgumentsVariable",
        "SetFieldOfPrimitive.js": "SetFieldOfPrimitive",
        "StyleMisuse.js": "StyleMisuse",
        "ToStringGivesNonString.js": "ToStringGivesNonString",
        "UndefinedOffset.js": "UndefinedOffset",
        "NoEffectOperation.js": "NoEffectOperation",
        "FunctionAsObject.js": "FunctionAsObject",
        "AccessToProto.js": "AccessToProto",
        "AddEnumerablePropertyToObject.js": "AddEnumerablePropertyToObject",
        "ConstructWrappedPrimitive.js": "ConstructWrappedPrimitive",
        "FunctionCalledWithMoreArguments.js": "FunctionCalledWithMoreArguments",
        "FunctionToString.js": "FunctionToString",
        "SimilarPropertyName.js": "SimilarPropertyName",
        "ShadowProtoProperty.js": "ShadowProtoProperty",
        "NonNumericArrayProperty.js": "NonNumericArrayProperty",
        "OverwrittenPrototype.js": "OverwrittenPrototype",
        "DelayedCodeString.js": "DelayedCodeString",
        "GlobalThis.js": "GlobalThis",
        "IllegalUseOfArgumentsVariable.js": "IllegalUseOfArgumentsVariable",
        "CompareFunctionWithPrimitives.js": "CompareFunctionWithPrimitives",
        "ExtraCommaInArrayLiteral.js": "ExtraCommaInArrayLiteral",
        "InconsistentConstructor.js": "InconsistentConstructor",
        "ForInArray.js": "ForInArray"
    };

    var checkers = [];
    var AnalysisStr2CheckerName = {};
    for (var checkerName in checkerName2AnalysisStr) {
        if (checkerName2AnalysisStr.hasOwnProperty(checkerName)) {
            checkers.push(checkerName);
            var analysisStr = checkerName2AnalysisStr[checkerName];
            AnalysisStr2CheckerName[analysisStr] = checkerName;
        }
    }

    // gather all analysisResults.json files
    // and store the result into analysisDB
    outter: for (i = 0; i < benchmarks.length; i++) {
        dir = EXP_RESULT_DIR + '/' + benchmarks[i];
        if (!fs.existsSync(dir)) {
            console.log(' **** [warning]: dir ' + dir + ' does not exist *** ');
            continue outter;
        }
        var files = fs.readdirSync(dir);
        inner: for (var j in files) {
            if (!files.hasOwnProperty(j)) continue inner;
            var subdir = files[j];
            if (!fs.lstatSync(dir + '/' + subdir).isDirectory()) continue inner;
            // store jsonfile content into analysisDB
            var jsonfile = dir + '/' + subdir + '/' + ANALYSIS_RES_JSON;
            if (!fs.existsSync(jsonfile)) {
                continue inner;
            }
            console.log(jsonfile);
            if (typeof analysisDB[benchmarks[i]] === 'undefined')
                analysisDB[benchmarks[i]] = {};
            var obj = JSON.parse(fs.readFileSync(jsonfile, "utf8"));
            // each program may have multiple pages
            var new_obj = [];
            for (var pageIndex = 0; pageIndex < obj.length; pageIndex++) {
                // if octane or webpage's format
                if (obj[pageIndex] && (typeof obj[pageIndex].url) !== 'undefined') {
                    for (var warnIndex = 0; warnIndex < obj[pageIndex].value.length; warnIndex++) {
                        obj[pageIndex].value[warnIndex].pageUrl = obj[pageIndex].url;
                        new_obj.push(obj[pageIndex].value[warnIndex]);
                    }
                } else if (obj[pageIndex]) { // else if sunspider's format
                    var warnIndex = pageIndex;
                    new_obj.push(obj[warnIndex]);
                }
            }
            new_obj = filter(new_obj);
            analysisDB[benchmarks[i]][subdir] = new_obj;
        }
    }

    function filter(warnings) {
        var warnings_new = [];
        for (var i = 0; i < warnings.length; i++) {
            /*
            if (warnings[i].analysis === 'FunctionAsObject')
                continue;
            if (warnings[i].analysis === 'SimilarPropertyName')
                continue;
            if (warnings[i].analysis === 'ShadowProtoProperty')
                continue;
            if (warnings[i].analysis === 'FunctionCalledWithMoreArguments')
                continue;
            if (warnings[i].analysis === 'CompareFunctionWithPrimitives' && warnings[i].locationString.indexOf('jquery') >= 0)
                continue;
            if (warnings[i].locationString.indexOf('jquery') >= 0)
                continue;
            */
            warnings_new.push(warnings[i]);
        }
        return warnings_new;
    }

    // init stat
    stat = {
        "all benchmark": {
            "total": {}
        }
    };
    stat['all benchmark'].total = {
        TP: 0, // true positives
        //TN: 0, // true negatives
        FP: 0, // false positives
        FN: 0, // false negatives
        UK: 0 // unknown
    };

    for (var benchmark in analysisDB) { // each benchmark
        if (!analysisDB.hasOwnProperty(benchmark)) continue;
        var subDB = analysisDB[benchmark];
        stat[benchmark] = {};
        // each program in benchmark
        for (var file in subDB) {
            if (!subDB.hasOwnProperty(file)) continue;
            stat[benchmark][file] = {
                TP: 0,
                //TN: 0,
                FP: 0,
                FN: 0,
                UK: 0
            };
        }
    }

    // compare with ground truth file
    for (var benchmark in analysisDB) { // each benchmark
        if (!analysisDB.hasOwnProperty(benchmark)) continue;
        var subDB = analysisDB[benchmark];
        // each program in benchmark
        for (var file in subDB) {
            if (!subDB.hasOwnProperty(file)) continue;
            var warnDB = subDB[file];
            // each warning in the program
            for (var warnIdx = 0; warnIdx < warnDB.length; warnIdx++) {
                var warning = warnDB[warnIdx];
                analysisWarning(groundTruth, {
                    benchmark: benchmark,
                    filename: file,
                    warning: warning
                }, stat);
            }
        }
    }

    // collect false negative information
    // (bugs that are not identified)
    for (var truthIdx = 0; truthIdx < groundTruth.length; truthIdx++) {
        var truth = groundTruth[truthIdx];
        if (truth.label !== 'bug') continue;
        if (truth.identified) continue;
        if (stat[truth.benchmark]) {
            if (stat[truth.benchmark][truth.filename])
                stat[truth.benchmark][truth.filename].FN++;
        }
    }

    var fileContent = JSON_to_CSV(stat);
    var fileName = 'exp/statistics.csv';
    fs.writeFileSync(fileName, fileContent);
    console.log('result written into file: ' + fileName);

    // convert the benchmark data base object into the csv file
    function JSON_to_CSV(stat) {
        var headline = 'benchmark/category, program/address, true positives, false positives, unknowns';

        var result;

        for (var i = 0; i < checkers.length; i++) {
            headline += ',' + checkers[i];
        }
        result = headline + '\r\n';

        for (var benchmark in stat) {
            if (!stat.hasOwnProperty(benchmark)) continue;
            var subStat = stat[benchmark];
            for (var program in subStat) {
                if (!subStat.hasOwnProperty(program)) continue;
                var data = [];
                data.push(benchmark);
                data.push(program);
                data.push(subStat[program].TP);
                data.push(subStat[program].FP);
                //data.push(subStat[program].FN);
                data.push(subStat[program].UK);

                for (var checkerIdx = 0; checkerIdx < checkers.length; checkerIdx++) {
                    if (checkers[checkerIdx] in subStat[program]) {
                        var num = subStat[program][checkers[checkerIdx]];
                        if (num <= warningThreshold) {
                            data.push(num);
                        } else {
                            data.push('+');
                        }
                    } else {
                        data.push('-');
                    }

                }
                result += data.join(',') + '\r\n';
            }
        }
        return result;
    }

    function analysisWarning(groundTruth, warnObj, stat) {
        var id = warnObj.benchmark + '-' + warnObj.filename + '-' + warnObj.warning.iid + '-' + warnObj.warning.analysis + '-' + warnObj.warning.details;
        if (set [id] === true) { /*console.log(id);*/
            return;
        } // if this warning is already there, return
        set [id] = true;
        var checkerName = AnalysisStr2CheckerName[warnObj.warning.analysis];
        var foundMatch = false;

        for (var truthIdx = 0; truthIdx < groundTruth.length; truthIdx++) {
            var truth = groundTruth[truthIdx];
            if (warnObj.benchmark === truth.benchmark && warnObj.filename === truth.filename && warnObj.warning.locationString === truth.locationString && warnObj.warning.analysis === truth.type
                /*&& warnObj.warning.iid + "" === truth.iid + ""
                && truth.details === warnObj.warning.details*/
            ) {
                // found a match
                if (truth.label === '[TBD]') {
                    stat[warnObj.benchmark][warnObj.filename].UK++;
                    stat['all benchmark'].total.UK++;
                } else if (truth.label === 'bug') {
                    stat[warnObj.benchmark][warnObj.filename].TP++;
                    stat['all benchmark'].total.TP++;
                    truth.identified = true; // this bug is successfully identified
                } else if (truth.label === 'clean') {
                    stat[warnObj.benchmark][warnObj.filename].FP++;
                    stat['all benchmark'].total.FP++;
                } else {
                    stat[warnObj.benchmark][warnObj.filename].UK++;
                    stat['all benchmark'].total.UK++;
                }
                foundMatch = true;
                break;
            }
        }

        // increate number
        stat[warnObj.benchmark][warnObj.filename][checkerName] = (stat[warnObj.benchmark][warnObj.filename][checkerName] | 0) + 1;

        stat['all benchmark'].total[checkerName] = (stat['all benchmark'].total[checkerName] | 0) + 1;

        if (!foundMatch) {
            stat[warnObj.benchmark][warnObj.filename].UK++;
            stat['all benchmark'].total.UK++;
        }
    }
})();