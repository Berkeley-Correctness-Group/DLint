# DLint


[Wiki](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Wiki-Page) | [Configuring](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Developer-Guide#how-to-configure-dlint-checkers) | [Checkers](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Checkers) | [Develop](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Developer-Guide) | [Mailing List](https://groups.google.com/forum/#!forum/dlint) | [Homepage](http://berkeley-correctness-group.github.io/DLint/)


DLint is a tool for dynamically checking JavaScript coding practices.   

Briefly speaking, [JSHint](http://jshint.com/), [JSLint](http://www.jslint.com/) and [ESLint](http://eslint.org/) uses static analysis (scan the code) to find bad coding practices, while DLint uses dynamic analysis (by analysing runtime behavior) to do the detection. 

By analyzing runtime information, DLint is capable of capturing violations of coding practices missed by those static analysis tools.
(See an [online demo](https://www.eecs.berkeley.edu/~gongliang13/jalangi_ff/demo_integrated.htm) of dynamic analysis.)

For more details, a [Wiki page](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Wiki-Page) is available

**Academic Resources:** [Preprint](http://jacksongl.github.io/files/dlint.pdf) in [ISSTA'15](http://issta2015.cs.uoregon.edu/) | [Slides](http://jacksongl.github.io/files/dlint_slides.pdf) | [Technical Report](http://www.eecs.berkeley.edu/Pubs/TechRpts/2015/EECS-2015-5.pdf) | [Bibtex](http://jacksongl.github.io/bibtex/dlint.html)

### Requirements
Make sure that you have the following software installed ([See more](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Install-DLint-Manually#requirements)).  
  * Latest version of [Node.js](http://nodejs.org/).
  * Sun's JDK 1.6 or higher.
  * Command-line git.  
  * Chrome browser if you need to test web apps.
  * Python (http://python.org) version 2.7 or higher

<!--- 
  * libgmp (http://gmplib.org/) is required by cvc3.  Concolic testing uses cvc3 and automaton.jar for constraint solving. The installation script checks if cvc3 and automaton.jar are installed properly.
-->

**Note:** This project currently only supports Mac OS 10+ (64bit).

Install DLint
--------------
Use the following command to install DLint:
```
mkdir dlint
cd dlint
git clone https://github.com/Berkeley-Correctness-Group/DLint.git
cd DLint
./scripts/install.sh
```
(A backup option is to [manually install DLint](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Install-DLint-Manually).)

Use DLint
----------
<!---  
Everytime when you open a new cmd window, go to DLint dir first, then (always
remember to) set the path:
```
export PATH="`pwd`/scripts/path_unix":$PATH
```
-->

All following instructions assume that the cmd directory is the ```DLint``` git local repository.
<!---
and that both the main [jalangi](http://github.com/SRA-SiliconValley/jalangi) directory and [noide](https://github.com/JacksonGL/noide) directory are sibling directories of DLint.
-->

#### Use DLint on Websites

Apply Dlint to a real-world website:
```
./scripts/dlint.sh <URL>
```
For example:
```
./scripts/dlint.sh www.sencha.com
```

<!---
More examples:
```
./scripts/dlint.sh rallyinteractive.com
./scripts/dlint.sh jackietrananh.com
./scripts/dlint.sh inspectelement.com/theme/expressive
./scripts/dlint.sh www.apple.com/macbook
```
-->
Please do not interact with the DLint-started browser, DLint will automatically close the browser after analysis. When it is done, all executed files and analysis result will be dumped in ```websites\<URL>``` directory, in which ```analysis.json``` contains all DLint warnings.  
(A [step-by-step guide](https://github.com/Berkeley-Correctness-Group/DLint/wiki/Try-DLint-on-a-Virtual-Machine#step-3-use-dlint-in-the-vm) is available.)


To view the DLint results in GUI (modified [noide](https://github.com/davidjamesstone/noide) file viewer), open a new terminal (under DLint repository dir) and type the following command:
```
node ../noide/bin/noide.js websites/
```
In browser, view the page with this URL: 
[http://localhost:3000/editor](http://localhost:3000/editor)

![](https://raw.githubusercontent.com/Berkeley-Correctness-Group/DLint/master/doc/image/view_warning.PNG)

---

#### Use DLint on a Single File

Suppose there is a JS file ```tests/dlint/buggy_CheckNaN.js```:
```
python scripts/dlint.py tests/dlint/buggy_CheckNaN
```
Warnings are written to console and ```jalangi_tmp/analysisResults.json```.

Configure and Extend DLint
------------------------------
DLint framework is designed to easily add new dynamic analysis by
adding a new file and overriding a few functions. ([See More](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Developer-Guide)).


Try DLint on VirtualBox
------------------------------
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


Citation
------------------------------

Please cite DLint in your publications if it helps your research:

    @inproceedings{gong2015dlint,
     author = {Gong, Liang and Pradel, Michael and Sridharan, Manu and Sen, Koushik},
     title = {DLint: Dynamically Checking Bad Coding Practices in JavaScript},
     booktitle = {Proceedings of the 2015 International Symposium on Software Testing and Analysis},
     series = {ISSTA 2015},
     year = {2015}
    } 
