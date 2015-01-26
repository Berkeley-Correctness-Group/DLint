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

(function() {

    var fs = require('fs');
    var child_process = require('child_process');
    var testDir = "./tests/html/dlint";
    var resultFile = "/tmp/analysisResults.json";
    var allFiles = fs.readdirSync(testDir);
    var executedAndAnalyzed = 0;
    var failedTotal = 0;
    var failedFalsePositive = 0;
    var failedFalseNegative = 0;
    var testRunning = false;
    var testDirsToAnalyze = allFiles.filter(function(file) {
        return file.indexOf("buggy_") === 0 || file.indexOf("okay_") === 0;
    });
    var verbose = false;
    var testsToDo = testDirsToAnalyze.length;
    console.log("Tests to run: " + testsToDo);
    while (testDirsToAnalyze.length > 0) {
        var test = testDirsToAnalyze.pop();
        var expectWarning = test.indexOf("buggy_") === 0;
        runAndAnalyzeTest(test, expectWarning);
    }
    var output = [];
    printResults();
    function runAndAnalyzeTest(testDir, expectWarning) {
        if (testRunning) {
            setTimeout(runAndAnalyzeTest.bind(null, testDir, expectWarning), 10);
            return;
        }
        eraseOldWarnings();
        testRunning = true;
        var cmd = 'java -cp thirdparty/selenium-server-standalone-2.41.0.jar:thirdparty/ evaluation.ExperimentRunner --url "http://127.0.0.1:8000/tests/html/dlint/' + testDir + '"';
        console.log(cmd);
        child_process.exec(cmd,
              function(error, stdout, stderr) {
                  if (verbose)
                      console.log(cmd);
                  if (!error) {
                      if (verbose)
                          console.log(stdout);
                      var hasWarning = checkForWarnings();
                      if (verbose)
                          console.log('expect warning: ' + expectWarning);
                      if (verbose)
                          console.log('has warning: ' + hasWarning);
                      process.stdout.write(".");
                      if (expectWarning && !hasWarning) {
                          output.push("  " + testDir + ": FAILED (didn't get expected warning)");
                          failedTotal++;
                          failedFalseNegative++;
                      } else if (!expectWarning && hasWarning) {
                          output.push("  " + testDir + ": FAILED (get unexpected warning)");
                          failedTotal++;
                          failedFalsePositive++;
                      } else {
                          output.push("  " + testDir + ": OK");
                      }
                  } else {
                      console.log("Error: Couldn't execute test!");
                      if (verbose)
                          console.log(stderr);
                      failedTotal++;
                  }
                  executedAndAnalyzed++;
                  testsToDo--;
                  testRunning = false;
              });
    }

    function eraseOldWarnings() {
        if (fs.existsSync(resultFile))
            fs.unlinkSync(resultFile);
    }

    function checkForWarnings() {
        if (!fs.existsSync(resultFile))
            return false;
        var resultsRaw = fs.readFileSync(resultFile, {encoding:'utf8'});
        var results = JSON.parse(resultsRaw);
        return results.length > 0;
    }

    function printResults() {
        if (testsToDo > 0) {
            setTimeout(printResults, 100);
            return;
        }
        console.log();
        output.sort().forEach(function(line) {
            console.log(line);
        });
        console.log("Executed: " + executedAndAnalyzed + ", failed: " + failedTotal + " (" + failedFalsePositive + " false positives, " + failedFalseNegative + " false negatives)");
    }

}
)();