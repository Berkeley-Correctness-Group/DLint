#
# Copyright 2014 University of California, Berkeley.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#		http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Author: Michael Pradel (michael@binaervarianz.de)

import os
import sys
import tempfile
import shutil
import string
import subprocess
import fnmatch
import re

## This script is called from a modified version of Firefox.
## It instruments .js files for in-browser analysis with Jalangi.
## When calling this script, the current working directory must be jalangi-dlint.

print("instrumentFF.py called with: %s " % str(sys.argv))

# paths and directories
jalangiDLintBaseDir = os.getcwd()+"/";
jalangiBaseDir = jalangiDLintBaseDir+"/../jalangi/"
workingDirName = jalangiDLintBaseDir+"instrumentFF_tmp/"
urlsFile = workingDirName+"urlsMap.jsonLike"

## URLs to include
included = [ r'127.0.0.1', r'^http' ]
# .js files to exclude (e.g., libraries)
#excluded = [ r'jquery', r'mootools', r'bootstrap', r'peg-0.6.2', r'date.js', r'less-1.2.0', r'interactions.js', r'yui', r'tinymce' ]
excluded = [ ]

sys.path.append('scripts')
import dlintAnalyses
jalangiAnalysisFiles = [ 
   jalangiBaseDir+"src/js/analyses2/ChainedAnalyses2.js",
] + dlintAnalyses.get(jalangiDLintBaseDir+'src/js/analyses/dlint/');

analysisDotJs = "src/js/analysis2.js"  # for dlint2

# whether to preprocess code before giving it to the Jalangi instrumenter
# (disable unless you're running the inconsistentType analysis)
preprocess = False

## constants
jalangiSuffix = "_jalangi_.js"
valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
jalangiLibs = [
    "src/js/Constants.js",
    "src/js/Config.js",
    "src/js/Globals.js",
    "src/js/TraceWriter.js",
    "src/js/TraceReader.js",
    "src/js/SMemory.js",
    "src/js/iidToLocation.js",
    "src/js/RecordReplayEngine.js",
    analysisDotJs,
    "node_modules/escodegen/escodegen.browser.min.js",
    "node_modules/acorn/acorn.js",
    "src/js/utils/astUtil.js",
    "src/js/instrument/esnstrument.js"
    ]

## functions
def checkUsage():
  if (len(sys.argv) < 2 or
      (sys.argv[1] == "--checkURL" and len(sys.argv) != 3) or
      (sys.argv[1] == "--firstTime" and len(sys.argv) != 5) or
      (sys.argv[1] != "--checkURL") and sys.argv[1] != "--firstTime" and len(sys.argv) != 4):
    printHelp()
    sys.exit(-1)

def printHelp():
  print "Usage: instrumentFF --checkURL URL"
  print "       instrumentFF [--firstTime] input.js output.js originalFileName.js"

def checkURL(url):
  for incl in included:
    if re.search(incl, url):
      sys.exit(0)
  sys.exit(1)

def instrument():
  args = sys.argv[:]
  firstTime = False
  if sys.argv[1] == "--firstTime":
    firstTime = True
    args.remove("--firstTime")
  tmpOrig = args[1]
  tmpInstr = args[2]
  rawRealFileName = args[3]
  
  realFileName = ''.join(c for c in rawRealFileName if c in valid_chars)
  realFileName = realFileName[0:100] # truncate long names
  
  workingDir = os.path.dirname(workingDirName)
  if not os.path.exists(workingDir):
    os.makedirs(workingDir)
  
  if not realFileName.endswith(".js"):
    realFileName = realFileName+".js"
  
  # optionally, exclude some files, e.g., complex libraries
  for ex in excluded:
    if re.search(ex, realFileName):
      print "Will not instrument "+realFileName
      if firstTime:
        print " .. but will add jalangi libs"
        f = open(tmpInstr, 'w')
        addJalangiLibs(f)
        f.write(open(tmpOrig).read()) 
        f.close()
      else:
        shutil.copyfile(tmpOrig, tmpInstr)
      sys.exit(0)
  
  # short cut: use cached file if we already instrumented it
  cachedOrigFile = findCachedFile(realFileName, workingDir, tmpOrig)
  if cachedOrigFile != None:
    cachedInstrFile = re.sub(r'\.js$', jalangiSuffix, cachedOrigFile)
    if firstTime:
      cachedInstrFileWithLibs = cachedInstrFile+"_withJalangiLibs"
      if os.path.exists(cachedInstrFileWithLibs):
        shutil.copyfile(cachedInstrFileWithLibs, tmpInstr);
        print "Reusing cached file "+cachedInstrFileWithLibs
        sys.exit(0)
      else:
        f = open(tmpInstr, 'w')
        addJalangiLibs(f)
        f.write(open(cachedInstrFile).read()) 
        f.close()
        print "Reusing cached file "+cachedInstrFile+", after adding jalangi libs"
        sys.exit(0)
    else:
      shutil.copyfile(cachedInstrFile, tmpInstr);
      print "Reusing cached file "+cachedInstrFile
      sys.exit(0)
  
  # beautify source code
  cmd = [ "js-beautify", "-r", tmpOrig ]
  try:
    subprocess.call(cmd)
  except OSError as e:
    print "To beautify source code before instrumentation, install js-beautify."
 
  # run pre-processor (e.g., to add annotations to be used by a runtime analysis)
  if preprocess:
    cmd = [ "node", "src/js/analyses/inconsistentType/Preprocessor.js", tmpOrig, tmpOrig ]
    subprocess.call(cmd)

  uniqueFileName = makeUniqueFileName(realFileName, workingDir)
  orig = os.path.join(workingDir, uniqueFileName)
  
  shutil.copyfile(tmpOrig, orig)
  
  cmd = [ "node", jalangiBaseDir+"/src/js/instrument/esnstrument.js", "--dirIIDFile", workingDirName, "--noInstrEval", "--inlineIID", orig ]
  print "Calling Jalangi instrumenter with\n"+' '.join(cmd)
  subprocess.call(cmd)
  
  instr = re.sub(r'\.js$', jalangiSuffix, orig)
  
  # result file
  f = open(tmpInstr, 'w')
  # add jalangi libs (if needed)
  if firstTime:
    addJalangiLibs(f)
  # add instrumented code  
  if os.path.exists(instr):
    f.write(open(instr).read()+"\n\n") 
  f.close()
    
  # write original and sanitized URL to file
  writeURLsToFile(rawRealFileName, uniqueFileName)

  if firstTime:
    shutil.copyfile(tmpInstr, instr+"_withJalangiLibs")
  
  if os.path.exists(instr):
    shutil.move(workingDirName+"jalangi_sourcemap.js", os.path.join(workingDir, uniqueFileName+"_jalangi_sourcemap.js"))
    shutil.move(workingDirName+"jalangi_sourcemap.json", os.path.join(workingDir, uniqueFileName+"_jalangi_sourcemap.json"))


def makeUniqueFileName(realFileName, workingDir):
  candidate = realFileName
  i = 1
  while os.path.exists(os.path.join(workingDir, candidate)):
    candidate = re.sub(r'\.js$', `i`+".js", realFileName)
    i = i+1
  return candidate

def findCachedFile(realFileName, workingDir, tmpOrig):
  # disable caching while the analysis changes all the time (or delete instrumented files after each change)
  #return None
  print "Searching cached file for "+realFileName
  filePattern = re.sub(r'\.js$', "", realFileName)+"*"+".js"
  for file in os.listdir(workingDir):
    if fnmatch.fnmatch(file, filePattern):
      path = os.path.join(workingDir, file)
      cmpReturn = subprocess.call(["cmp", "--silent", tmpOrig, path]);
      if cmpReturn == 0:
        return path
  print ".. Nothing found"
  return None

def addJalangiLibs(f):
  f.write("// START OF JALANGI LIBS\n\n")
  f.write(open(jalangiDLintBaseDir+"src/js/analyses/InitDirectAnalysis.js").read())
  for jalangiLib in jalangiLibs:
    f.write(open(jalangiBaseDir+jalangiLib).read()+"\n;\n")
  for jalangiAnalysisFile in jalangiAnalysisFiles:
    f.write(open(jalangiAnalysisFile).read()+"\n;\n")
  f.write("\n\n// END OF JALANGI LIBS\n\n")

def writeURLsToFile(realName, processedName):
  f = open(urlsFile, 'a')
  f.write(processedName+": \""+realName+"\",\n") 
  f.close()

## main part
checkUsage()
if sys.argv[1] == "--checkURL":
  checkURL(sys.argv[2])
else:
  instrument()
