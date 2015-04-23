# DLint

Dynamically Checking Bad Coding Practices for JavaScript.   

Briefly speaking, [JSHint](http://jshint.com/), [JSLint](http://www.jslint.com/) and [ESLint](http://eslint.org/) uses static analysis (scan the code) to find bad coding practices, while DLint uses dynamic analysis (by analysing runtime behavior) to do the detection. By analyzing runtime information DLint is capable of capturing more violations of coding practices misses by those static analysis tools.

For more details, a [Wiki page](https://github.com/Berkeley-Correctness-Group/DLint/wiki) and a [technical report](http://www.eecs.berkeley.edu/Pubs/TechRpts/2015/EECS-2015-5.pdf) is available (to appear in [ISSTA'15](http://issta2015.cs.uoregon.edu/) soon).

### Requirements
Make sure that you have the following software installed ([More details](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Install-DLint-Manually#requirements)).  
  * Latest version of [Node.js](http://nodejs.org/).
  * Sun's JDK 1.6 or higher.
  * Command-line git.  
  * Chrome browser if you need to test web apps.
  * Python (http://python.org) version 2.7 or higher

<!--- 
  * libgmp (http://gmplib.org/) is required by cvc3.  Concolic testing uses cvc3 and automaton.jar for constraint solving. The installation script checks if cvc3 and automaton.jar are installed properly.
-->
**Note:** This project currently only supports Mac OS 10+ (64bit).

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
(A backup option is to [manually install DLint](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Install-DLint-Manually).)

### Usage

<!---  
Everytime when you open a new cmd window, go to DLint dir first, then (always
remember to) set the path:
```
export PATH="`pwd`/scripts/path_unix":$PATH
```
-->

All following instructions assume that the current working directory is the root direcotry of DLint git local repository.
<!---
and that both the main [jalangi](http://github.com/SRA-SiliconValley/jalangi) directory and [noide](https://github.com/JacksonGL/noide) directory are sibling directories of DLint.
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
(A [step-by-step guide](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Try-DLint-on-a-Virtual-Machine#step-3-use-dlint-in-the-vm) is available.)


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

### Adding New Analyses
DLint framework is designed to easily add new dynamic analysis by
adding a new file and overriding a few functions. ([More details](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Developer-Guide)).


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
