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

// Author: Michael Pradel (michael@binaervarianz.de), Liang Gong (gongliang13@cs.berkeley.edu)

(function() {

  var fs = require('fs');
  var child_process = require('child_process');
  var testDir = "./tests/dlint/";
  var allFiles = fs.readdirSync(testDir);
  var executedAndAnalyzed = 0;
  var failedTotal = 0;
  var failedFalsePositive = 0;
  var failedFalseNegative = 0;
  var testRunning = false;
  var testsToAnalyze = allFiles.filter(function(file) {
    return (file.indexOf(".js") === file.length - 3 &&
      file.indexOf("_jalangi_") === -1 &&
      file.indexOf("_sourcemap") === -1 &&
      file.indexOf("runAllTests.js") === -1 &&
      (file.indexOf("buggy_") === 0 || file.indexOf("okay_") === 0));
  });
  var verbose = false;
  var isDebug = false;
  if (process.argv[2] === 'verbose') // print all output
    verbose = true;
  if (process.argv[2] === 'debug') // only print test case output if there is something wrong
    isDebug = true;
  var testsToDo = testsToAnalyze.length;
  console.log("Tests to run: " + testsToDo);
  while (testsToAnalyze.length > 0) {
    var test = testsToAnalyze.pop();
    var expectWarning = test.indexOf("buggy_") === 0;
    runTest(test, runAndAnalyzeTest.bind(null, test, expectWarning));
  }
  var output = [];
  printResults();

  function runTest(file, continuation) {
    if (testRunning) {
      setTimeout(runTest.bind(null, file, continuation), 10);
      return;
    }
    if (verbose)
      console.log('\r\n\r\n\r\nstarting test: ' + file);
    testRunning = true;
    var cmd = "node " + testDir + file;
    child_process.exec(cmd,
      function(error, stdout, stderr) {
        if (verbose)
          console.log(cmd);
        if (error) {
          if (verbose)
            console.log(stderr);
          testsToDo--;
          process.stdout.write(".");
          output.push("  " + file + " crashes, will not analyze it.");
        } else {
          if (verbose)
            console.log(stdout);
          //setTimeout(continuation, 0);
          continuation();
        }
        //testRunning = false;
      });
  }

  function runAndAnalyzeTest(file, expectWarning) {
    //if (testRunning) {
    //  setTimeout(runAndAnalyzeTest.bind(null, file, expectWarning), 10);
    //  return;
    //}
    //testRunning = true;
    var cmd = "python ./scripts/dlint.py " + testDir + file.replace(/.js$/, '');
    child_process.exec(cmd,
      function(error, stdout, stderr) {
        if (verbose)
          console.log('\r\n\r\n' + cmd);
        if (!error) {
          //console.log(stdout);
          var hasWarning = false;
          var count = (stdout.match(new RegExp("DLint warning", "g")) || []).length;

          // console.log(stdout);
          // "executedLines" is part of the output of ExeStat.js
          // which is an analysis dumps information, not for reporting warnings
          if (stdout.indexOf('"executedLines":') >= 0) {
            count--;
          }
          // "startTime" and "endTime" are part of the output of Timer.js
          // which is an analysis dumps information, not for reporting warnings
          if (stdout.indexOf('"startTime":') >= 0 || stdout.indexOf('"endTime":') >= 0) {
            count--;
          }
          if (count >= 1) {
            hasWarning = true;
            // else only one or no warning
          } else { // else no warning
            hasWarning = false;
          }
          if (expectWarning !== hasWarning) {
            if (isDebug === true) {
              verbose = true;
              console.log();
            }
          }
          if (verbose)
            console.log(stdout);
          // console.log(hasWarning);

          if (verbose)
            console.log('expect warning: ' + expectWarning);
          if (verbose)
            console.log('has warning: ' + hasWarning + '\r\n');
          process.stdout.write(".");
          if (expectWarning && !hasWarning) {
            output.push("  " + file + ": FAILED (didn't get expected warning)");
            failedTotal++;
            failedFalseNegative++;
          } else if (!expectWarning && hasWarning) {
            output.push("  " + file + ": FAILED (get unexpected warning)");
            failedTotal++;
            failedFalsePositive++;
          } else {
            output.push("  " + file + ": OK");
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
        if (isDebug === true) {
          verbose = false;
        }
      });
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

})();