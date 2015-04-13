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
/*
  This is an extensible iterator framework aimed at simplifying
  the processing of all intermediate files from all benchmarks

  example of usage:
  (function() {
    var dataIterator = require('./iterator.js').iterator;

    dataIterator.setDataDir('/Users/jacksongl/Box Sync');
    // iterate through all JavaScript Source Files
    dataIterator.iterateAllSourceFiles(callback, postCallback);
    // iterate through all DLint results
    dataIterator.iterate_DLint_Result_in_JSON(callback, postCallback);
    // iterate through all JSHint results
    dataIterator.iterate_JSHint_Result_in_JSON(callback, postCallback);

    function callback(benchmark, website, srcFilename, srcFileLocation) {
      console.log(benchmark);
      console.log(website);
      console.log(srcFilename);
      console.log(srcFileLocation);
    }
  })();
*/

(function() {
  var rawDataDir = process.cwd();
  var benchmarks = ['websites'];
  var ignoreSrcFileSuffix = ['_jalangi_sourcemap.js', '_jalangi_.js', '.jsonLike', '.json'];
  var fs = require('fs');
  var iterator = {};

  function ignoreSrcFile(srcFile) {
    // filter useless files
    var skip = false;
    ignoreSrcFileSuffix.forEach(function(value) {
      if (skip) return;
      if (srcFile.indexOf(value) >= 0) {
        skip = true;
      }
    });
    return skip;
  }

  // set the base directory of the raw dataset
  iterator.setDataDir = function(dir) {
    if (dir) {
      rawDataDir = dir;
    }
  };

  // set the names of root directory
  iterator.setBenchmarks = function(array) {
    benchmarks = array;
  }

  // iterate through all source files in the raw dataset
  // callback function parameters:
  // callback(benchmark, website, srcFilename, srcFileLocation)
  iterator.iterateAllSourceFiles = function(callback, postCallback) {
    outter: for (var i = 0; i < benchmarks.length; i++) {
      var dir = rawDataDir + '/' + benchmarks[i];
      if (!fs.existsSync(dir)) {
        console.log(' **** [warning]: dir ' + dir + ' does not exist *** ');
        continue outter;
      }
      var files = fs.readdirSync(dir);
      inner: for (var j in files) {
        if (!files.hasOwnProperty(j)) continue inner;
        var subdir = files[j];
        // if the subdir is not a directory, continue
        if (!fs.lstatSync(dir + '/' + subdir).isDirectory()) continue inner;
        // if there is no src subdirectory in subdir, continue
        if (!fs.lstatSync(dir + '/' + subdir + '/src').isDirectory()) continue inner;

        var srcDir = dir + '/' + subdir + '/src';
        var srcFiles = fs.readdirSync(srcDir);
        inner2: for (var srcIndex in srcFiles) {
          if (!srcFiles.hasOwnProperty(srcIndex)) continue inner2;
          var srcFile = srcFiles[srcIndex];
          if (ignoreSrcFile(srcFile)) continue inner2;
          if (callback) {
            var srcFileLocation = srcDir + '/' + srcFile;
            callback(benchmarks[i], subdir, srcFile, srcFileLocation);
          }
        }
      }
    }
    if (postCallback)
      postCallback();
  };

  // iterate dlint's result in the dataset
  // callback function parameters:
  // callback(benchmarks, website, jsonFile, jsonFileLocation);
  iterator.iterate_DLint_Result_in_JSON = function(callback, postCallback) {
    //console.log(rawDataDir);
    outter: for (var i = 0; i < benchmarks.length; i++) {
      var dir = rawDataDir + '/' + benchmarks[i];
      if (!fs.existsSync(dir)) {
        console.log(' **** [warning]: dir ' + dir + ' does not exist *** ');
        continue outter;
      }
      var files = fs.readdirSync(dir);
      inner: for (var j in files) {
        if (!files.hasOwnProperty(j)) continue inner;
        var subdir = files[j];
        // if the subdir is not a directory, continue
        if (!fs.lstatSync(dir + '/' + subdir).isDirectory()) continue inner;
        var jsonFile = 'analysisResults.json';
        var jsonFileLocation = dir + '/' + subdir + '/' + jsonFile;
        // if there is no analysisResults.json in subdir, continue
        if (!fs.existsSync(jsonFileLocation)) continue inner;
        if (callback) {
          callback(benchmarks[i], subdir, jsonFile, jsonFileLocation);
        }
      }
    }
    if (postCallback)
      postCallback();
  };

  // iterate JSHint's result in the dataset
  // callback function parameters:
  // callback(benchmarks, website, jsonFile, jsonFileLocation);
  iterator.iterate_JSHint_Result_in_JSON = function(callback, postCallback) {
    outter: for (var i = 0; i < benchmarks.length; i++) {
      var dir = rawDataDir + '/' + benchmarks[i];
      if (!fs.existsSync(dir)) {
        console.log(' **** [warning]: dir ' + dir + ' does not exist *** ');
        continue outter;
      }
      var files = fs.readdirSync(dir);
      inner: for (var j in files) {
        if (!files.hasOwnProperty(j)) continue inner;
        var subdir = files[j];
        // if the subdir is not a directory, continue
        if (!fs.lstatSync(dir + '/' + subdir).isDirectory()) continue inner;
        var jsonFile = 'JSHintResults.json';
        var jsonFileLocation = dir + '/' + subdir + '/' + jsonFile;
        // if there is no analysisResults.json in subdir, continue
        if (!fs.existsSync(jsonFileLocation)) continue inner;
        if (callback) {
          callback(benchmarks[i], subdir, jsonFile, jsonFileLocation);
        }
      }
    }
    if (postCallback)
      postCallback();
  };

  // iterate JSHint and Dlint's result in the dataset
  // callback function parameters:
  // callback(benchmarks, website, jshint_jsonFile, jshint_jsonFileLocation, 
  //                               dlint_jsonFile, dlint_jsonFileLocation);
  iterator.iterate_All_Lint_Result_in_JSON = function(callback, postCallback) {
    outter: for (var i = 0; i < benchmarks.length; i++) {
      var dir = rawDataDir + '/' + benchmarks[i];
      if (!fs.existsSync(dir)) {
        console.log(' **** [warning]: dir ' + dir + ' does not exist *** ');
        continue outter;
      }
      var files = fs.readdirSync(dir);
      inner: for (var j in files) {
        if (!files.hasOwnProperty(j)) continue inner;
        var subdir = files[j];
        // if the subdir is not a directory, continue
        if (!fs.lstatSync(dir + '/' + subdir).isDirectory()) continue inner;
        var jsonFile1 = 'JSHintResults.json';
        var jsonFileLocation1 = dir + '/' + subdir + '/' + jsonFile1;
        var jsonFile2 = 'analysisResults.json';
        var jsonFileLocation2 = dir + '/' + subdir + '/' + jsonFile2;
        // if there is no analysisResults.json in subdir, continue
        if (!fs.existsSync(jsonFileLocation1)) continue inner;
        if (!fs.existsSync(jsonFileLocation2)) continue inner;
        if (callback) {
          callback(benchmarks[i], subdir, jsonFile1, jsonFileLocation1, jsonFile2, jsonFileLocation2);
        }
      }
    }
    if (postCallback)
      postCallback();
  };

  // Make this iterator a Node module, if possible.
  if (typeof exports === "object" && exports) {
    exports.iterator = iterator;
  }
})();