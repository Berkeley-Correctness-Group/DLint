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
          if (verbose)
            console.log(stdout);
          //console.log(stdout);
          var hasWarning = false;
          var count = (stdout.match(new RegExp("DLint warning", "g")) || []).length;

          // console.log(stdout);
          // "executedLines" is part of the output of ExeStat.js
          // which is an analysis dumps information, not for reporting warnings
          if(stdout.indexOf('"executedLines":') >= 0) {
            count--;
          }
          // "startTime" and "endTime" are part of the output of Timer.js
          // which is an analysis dumps information, not for reporting warnings
          if(stdout.indexOf('"startTime":') >= 0 || stdout.indexOf('"endTime":') >= 0) {
            count--;
          }
          if(count >= 1) {
            hasWarning = true;
            // else only one or no warning
          } else { // else no warning
            hasWarning = false;
          }
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