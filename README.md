# DLint

Dynamically Checking Bad Coding Practices for JavaScript


### Before any actions

All following instructions assume that the current working directory is the root direcotry of DLint and that the main [jalangi](http://github.com/SRA-SiliconValley/jalangi) directory is a sibling directory of DLint (do not worry about it: commands in ```Install``` section will make sure this happens). This project currently supports Mac OS and Linux.

### Requirements

This project is built upon [jalangi](http://github.com/SRA-SiliconValley/jalangi).
If you already have Jalangi executed on your machine, you can skip this section and go to the ```Install``` section.


Jalangi is tested on Mac OS X 10.8 with Chromium browser.  Jalangi should work on Mac OS
10.7, Ubuntu 11.0 and higher and Windows 7 or higher. Jalangi will NOT work with IE.

  * Latest version of Node.js available at http://nodejs.org/.  We have tested Jalangi with Node v0.10.25.
  * Sun's JDK 1.6 or higher.  We have tested Jalangi with Java 1.6.0_43.
  * Command-line git.
  * libgmp (http://gmplib.org/) is required by cvc3.  Concolic testing uses cvc3 and automaton.jar for constraint solving. The installation script checks if cvc3 and automaton.jar are installed properly.
  * Chrome browser if you need to test web apps.
  * Python (http://python.org) version 2.7 or higher
  
On Windows you need the following extra dependencies:

  * Install Microsoft Visual Studio 2010 (Free express version is fine).
  * If on 64bit also install Windows 7 64-bit SDK.

If you have a fresh installation of Ubuntu, you can install all the requirements by invoking the following commands from a terminal.

    sudo apt-get update
    sudo apt-get install python-software-properties python g++ make
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs
    sudo add-apt-repository ppa:webupd8team/java
    sudo apt-get update
    sudo apt-get install oracle-java7-installer
    sudo update-java-alternatives -s java-7-oracle
    sudo apt-get install git
    sudo apt-get install libgmp10
    sudo apt-get install chromium-browser


### Install in 3 Simple Steps

**Step 1:**
execute the following commands to install everything you need to run DLint:
```
node src/js/install.js
npm install cli
npm install stats
npm install jshint
npm install doctrine
npm install yui jsdom
npm install node-js-beautify
npm install google-search-scraper
export PATH="`pwd`/scripts/path_unix":$PATH
```
**Step 2:** 

  * Install our custom version of Firefox: [Linux (64 bit)](http://mp.binaervarianz.de/jalangi/firefox-27.0a1.en-US.linux-x86_64.tar.bz2), [Mac OS (64 bit)](http://mp.binaervarianz.de/jalangi/firefox-27.0a1.en-US.mac64.dmg)
  * In file, ```src/java/evaluation/ExperimentRunner.java``` and
  ```src/java/evaluation/OctaneExperimentRunner.java```: Make sure the variable ```firefoxBinary``` points to the location where you installed the custom version of Firefox.
  ```java
  // modify the following assignment with the correct value.
  final String firefoxBinary = "/Applications/Nightly.app/Contents/MacOS/firefox-bin";
  ```

**Step3:**
execute the following command to compile the Java code:
```
javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar `pwd`/src/java/evaluation/ExperimentRunner.java
javac -d thirdparty -cp thirdparty/selenium-server-standalone-2.41.0.jar `pwd`/src/java/evaluation/OctaneExperimentRunner.java
```

Now you are good to go, have fun with DLint!

### Usage

Everytime when you open a new cmd window, go to DLint dir first, next alwasy
remember to set the path:
```
export PATH="`pwd`/scripts/path_unix":$PATH
```

Apply Dlint to a real-world website:
```
./scripts/dlint.sh <URL>
```
For example:
```
./scripts/dlint.sh www.google.com
```
Please do not interact with the DLint-started browser, DLint will automatically close the browser after analysis. When it is done, all executed files and analysis result will be dump in ```websites\<URL>``` directory, in which ```analysis.json``` contains all DLint warnings.

---


Apply DLint to a single JavaScript file:
```
python scripts/dlint.py tests/dlint/buggy_CheckNaN1
```
Warnings are printed to the console and also written to ```jalangi_tmp/analysisResults.json```.


### Automated Evaluation

To make running experiments as simple as possible, DLint can be automatically applied to the SunSpider benchmarks, the Octane benchmarks, a set of locally installed web applications, and an arbitrary list of web sites. Each of these scenarios creates a directory, e.g., sunspider, with one subdirectory per benchmark/web app/web site, e.g., sunspider/3d-cube.js/. The subdirectory always has the same structure:
 * ```src``` contains the uninstrumented JavaScript source code.
 * ```analysisResults.json``` contains the warnings found by DLint.

Run DLint for all **SunSpider** benchmarks:
```
./scripts/dlint_sunspider.sh
```

To run DLint for the **Octane** benchmarks, for **web applications**, and for external **web sites**, some setup is required:

 * For Octane and the locally installed web applications, start a HTTP server:
```
python -m SimpleHTTPServer
```

Run DLint for all **Octane** benchmarks:
```
./scripts/dlint_octane.sh
```

Run DLint for several **web applications**:
```
./scripts/dlint_webapps.sh
```

Run DLint on all web sites listed in ```tests/dlint/urls.txt```:
```
./scripts/dlint_websites.sh
```


### Adding New Analyses


To add a new analysis:  

 1. Add a .js file that implements the analysis to ```src/js/analyses/dlint```. At the end of the execution, each analysis passes DLintWarnings to the DLint object (see existing analyses).  
 2. Add the analysis to ```src/js/analyses/dlint/analyses.txt```.  
 3. Add tests for the analysis (see below).  


### Testing

Each analysis should have two kinds of tests:

  * Example programs that should trigger a warning. For node.js tests, add such programs to ```tests/dlint``` and name the file so that it starts with ```buggy_TheAnalysisName```, For browser tests, add such programs to ```tests/html/dlint``` in a directory that starts with ```buggy_TheAnalysisName```.  
  * Example programs that should **not** trigger a warning. For node.js tests, add such programs to ```tests/dlint``` and name the file so that it starts with ```okay_TheAnalysisName```. For browser tests, add such programs to ```tests/html/dlint``` in a directory that starts with ```okay_TheAnalysisName```.

To run all node.js tests:
```
node tests/dlint/runAllTests.js
```

To run all browser tests (requires the setup described above):
```
node tests/dlint/runAllBrowserTests.js
```
-------
To run a DLint warning and JSHint warning test:  

1. First make sure that a web server is started:
```
python -m SimpleHTTPServer
```
2. Run the following command on another terminal:
```
export PATH="/Users/jacksongl/macos-workspace/research/jalangi/github_dlint/gitprojects/jalangi-dlint/scripts/path_unix":$PATH
./scripts/dlint_lintTest.sh
```

It will first run Dlint on those webpages, then dump javascript files and warnings on the disk, finally, it will check if the number of those warnings and their types are correct.


### How to Configure DLint Checkers?

The current version of DLint consists of around 30 checkers. But you can choose which
checker to use when analyzing a web page.
To add/remove a checker, add/remove the checker's file name in ```src/js/analyses/dlint/analyses.txt```.

A configuration of ```src/js/analyses/dlint/analyses.txt``` (including all the analyses):
```
DLintPre.js
utils/Utils.js
utils/document.js
utils/RuntimeDB.js
utils/levenshtein.js
CheckNaN.js
ConcatUndefinedToString.js
NonObjectPrototype.js
SetFieldOfPrimitive.js
OverFlowUnderFlow.js
StyleMisuse.js
ToStringGivesNonString.js
UndefinedOffset.js
NoEffectOperation.js
AddEnumerablePropertyToObject.js
ConstructWrappedPrimitive2.js
FunctionToString.js
ShadowProtoProperty.js
NonNumericArrayProperty.js
OverwrittenPrototype.js
DelayedCodeString.js
GlobalThis.js
CompareFunctionWithPrimitives.js
InconsistentConstructor.js
FunctionCalledWithMoreArguments.js
IllegalUseOfArgumentsVariable.js
ForInArray.js
DoubleEvaluation.js
InconsistentNewCallPrefix.js
UncountableSpaceInRegexp.js
EmptyClassInRegexp.js
UseArrObjConstrWithoutArg.js
MissRadixArgInParseNum.js
FloatNumberEqualityComparison.js
ExeStat.js
Timer.js
DLintPost.js
```

### Experimental Section

For experiments part in the paper, go to this README file.
