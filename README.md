# DLint

Dynamically Checking Bad Coding Practices for JavaScript.   

Briefly speaking, [JSHint](http://jshint.com/), [JSLint](http://www.jslint.com/) and [ESLint](http://eslint.org/) uses static analysis (scan the code) to find bad coding practices, while DLint uses dynamic analysis (by analysing runtime behavior) to do the detection. By analyzing runtime information DLint is capable of capturing more violations of coding practices misses by those static analysis tools.

For more details, a [Wiki page](https://github.com/Berkeley-Correctness-Group/DLint/wiki) and a [technical report](http://www.eecs.berkeley.edu/Pubs/TechRpts/2015/EECS-2015-5.pdf) is available (to appear in [ISSTA'15](http://issta2015.cs.uoregon.edu/) soon).

### Before any actions

All following instructions assume that the current working directory is the root direcotry of DLint and that the main [jalangi](http://github.com/SRA-SiliconValley/jalangi) directory is a sibling directory of DLint (do not worry about it: commands in ```Install``` section will make sure this happens).   
**Note:** This project currently only supports Mac OS 10+ (64bit).

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


### Install DLint on 64-bit Mac OS

Use the following command to install DLint:
```
mkdir dlint
cd dlint
git clone https://github.com/Berkeley-Correctness-Group/DLint.git
cd DLint
./scripts/install.sh
```

Now you are good to go, have fun with DLint!
(if it does not work, please [manually install DLint](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Install-DLint-Manually).)

### Usage

<!---  
Everytime when you open a new cmd window, go to DLint dir first, then (always
remember to) set the path:
```
export PATH="`pwd`/scripts/path_unix":$PATH
```
-->

Apply Dlint to a real-world website:
```
./scripts/dlint.sh <URL>
```
For example:
```
./scripts/dlint.sh www.sencha.com
```

More examples:
```
./scripts/dlint.sh rallyinteractive.com
./scripts/dlint.sh jackietrananh.com
./scripts/dlint.sh inspectelement.com/theme/expressive
./scripts/dlint.sh www.apple.com/macbook
```
Please do not interact with the DLint-started browser, DLint will automatically close the browser after analysis. When it is done, all executed files and analysis result will be dumped in ```websites\<URL>``` directory, in which ```analysis.json``` contains all DLint warnings.

A [step-by-step guide](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Try-DLint-on-a-Virtual-Machine#step-3-use-dlint-in-the-vm) is available.


To view the DLint results in GUI (modified [noide](https://github.com/davidjamesstone/noide) file viewer), open a new terminal (under DLint repository dir) and type the following command:
```
node ../noide/bin/noide.js websites/
```
Open a browser and goto the following url:
```
http://localhost:3000/editor
```

![](https://raw.githubusercontent.com/Berkeley-Correctness-Group/DLint/master/doc/image/view_warning.PNG)

---


Apply DLint to a single JavaScript file:
```
python scripts/dlint.py tests/dlint/buggy_CheckNaN
```
Warnings are written to console and ```jalangi_tmp/analysisResults.json```.


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

Run DLint on all web sites listed in ```tests/dlint/urls.txt```:
```
./scripts/dlint_websites.sh
```


### Adding New Analyses


To add a new analysis:  

 1. Add a .js file that implements the analysis to ```src/js/analyses/dlint```. At the end of the execution, each analysis passes DLintWarnings to the DLint object (see existing analyses).  
 2. Add the analysis to ```src/js/analyses/dlint/analyses.txt```.  
 3. Add tests for the analysis (see below).  

**Note:** DLint framework currently adopts [analysis2 API](https://github.com/SRA-SiliconValley/jalangi/blob/master/docs/analysis2.md) in [Jalangi](https://github.com/SRA-SiliconValley/jalangi) (not [Jalangi2](https://github.com/Samsung/jalangi2)). It is primarily because Jalangi2 was not released when DLint was developed. We plan to migrate to Jalangi2 later.

### Testing

Each analysis should have two kinds of tests:

  * Example programs that should trigger a warning. For node.js tests, add such programs to ```tests/dlint``` and name the file so that it starts with ```buggy_TheAnalysisName```, For browser tests, add such programs to ```tests/html/dlint``` in a directory that starts with ```buggy_TheAnalysisName```.  
  * Example programs that should **not** trigger a warning. For node.js tests, add such programs to ```tests/dlint``` and name the file so that it starts with ```okay_TheAnalysisName```. For browser tests, add such programs to ```tests/html/dlint``` in a directory that starts with ```okay_TheAnalysisName```.

To run all node.js tests (```verbose``` and ```debug``` are optional):
```
node tests/dlint/runAllTests.js [ verbose | debug ]
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
export PATH="`pwd`/scripts/path_unix":$PATH
./scripts/dlint_lintTest.sh
```

It will first run Dlint on those webpages, then dump javascript files and warnings on the disk, finally, it will check if the number of those warnings and their types are correct.


### How to Configure DLint Checkers?

The current version of DLint consists of around 30 checkers. But you can choose which
checker to use when analyzing a web page.
To add/remove a checker, add/remove the checker's file name in ```src/js/analyses/dlint/analyses.txt```.

**Note:** Do not put any analysis before ```DLintPre.js``` or after ```DLintPost.js```. If analysis A depends on analysis B, A should be listed after B in the configuration file.

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
jsBuiltinFunctionChecker/DocumentFunctionsMisuse.js
jsBuiltinFunctionChecker/StringFunctionsMisuse.js
jsBuiltinFunctionChecker/RegExpFunctionsMisuse.js
jsBuiltinFunctionChecker/NumberFunctionsMisuse.js
jsBuiltinFunctionChecker/ObjectFunctionsMisuse.js
jsBuiltinFunctionChecker/GlobalFunctionsMisuse.js
jsBuiltinFunctionChecker/ArrayFunctionsMisuse.js
jsBuiltinFunctionChecker/DateFunctionsMisuse.js
ExeStat.js
Timer.js
DLintPost.js
```

### Try DLint on VirtualBox

If you do not have a Mac or Linux OS or a 64bit machine (or if you just want to try DLint without going through those installation steps), one option would be using DLint on a virtual machine. A step-by-step guide is [available](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Try-DLint-on-a-Virtual-Machine).

Download [VirtualBox](https://www.VirtualBox.org/) and [DLint VirtualBox image](https://berkeley.box.com/s/m6eys03sihdfm030hqdhaqy05smgjpcb) (1.28GB, MD5: ```1429e4a3bda83169b6ea195952c25c4e```)

In the guest OS, open a terminal and type the following commands (or double click the bash script on the desktop):

```
cd ~/dlint/DLint
export PATH="`pwd`/scripts/path_unix":$PATH
```
Root password: ```123```  
Guest OS: 64-bit Linux Ubuntu 12.04  
VM Memory: 512M  
VM Video Memory: 128M  
Image Size: 4.7 GB  
Maximal VM Virtual Disk Size: 20.30 GB  
