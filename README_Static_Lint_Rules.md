This document is created for the DLint project aiming at collecting all those bad code practices suggested in books and those checked by static analysis tools.  
**Author:** Liang Gong (gongliang13@cs.berkeley.edu)

-----------------
Copy and paste the content of this document into an online Github Markdown editor to have a better view.  
Online Viewer: http://jbt.github.io/markdown-editor  
                                         
-----------------

### "Effective JavaScript" Rules (that can be checked by Jalangi)
**(based on description in ```Effective JavaScript```)**


#### Rule-1. ```valueOf``` and ```toString``` (P.14)
Object with ```valueOf``` methods should implement a ```toString``` method that provides a string representation of the number produced by ```valueOf```.

```javascript
"J" + { toString: function() { return "S"; } };   // "JS"
  2 * { valueOf: function() { return 3; } };      //  6
```
When an object contains both a ```toString``` and a ```valueOf``` methods, it't not obvious which method ```+``` should call.


#### Rule-2. ```typeof``` and ```undefined``` (P.14)
Use ```typeof``` or comparison to ```undefined``` rather than truthiness to test for undefined values.

#### Rule-3. set field to primitive values (P.16)
Checked by DLint already.

#### Rule-4. Surrogate pairs related issues (P.29)
Some special character occupies 2 code points (length 2) in ```String.length``` result.
mentioned in the DLint draft.

#### Rule-5. Never modify the ```arguments``` object (P.68)
In non-strict mode, changing ```arguments``` element means changing the the parameter variable values.

#### Rule-6. Never modify ```__proto__``` (P.88)
Checked by DLint already (OverwrittenPrototype).

#### Rule-7. Avoid modifying the prototype objects (P.110)
Bad practice:
```javascript
Array.prototype.split = function (i) {
    ...
};
```

#### Rule-8. Avoid adding properties to ```Object.prototype``` (P.127)
Checked by DLint already (AddEnumerablePropertyToObject).

#### Rule-9. Prefer ```for``` Loops to ```for...in``` Loops for Array Iteration (P.132)
Checked by DLint already (ForInArray).

#### Rule-10. ```arguments``` related code practices (P.139)
```javascript
function namesColumn() {
  return ["Names"].concat(arguments);
}
namesColumn("Alice", "Bob", "Chris");
// ["Names", { 0: "Alice", 1: "Bob", 2: "Chris"}]
```

To do: Add a checker that warns about passing 'arguments' to Array.concat.

#### Rule-11. Overriden Built-in objects (P.140)

```javascript
Array = String;
new Array(1, 2, 3, 4, 5); // new String(1)
```
Currently ```OverwriteBuiltinVariable``` analysis checks overwriting the following variables:

```arguments```, ```window```, ```document```, ```undefined```, ```Boolean```, ```String```, ```Array```

Maybe we can come up with more built-in variables? MP: To do: ```global```


#### Rule-12. Truthiness is not always a safe test (P.147)
```javascript
function Server(port, hostname) {
    hostname = new String(hostname || "localhost");
}
```
Beware: Truthiness is not always a safe test. If a function should accept the empty string as a legal value, a truthy test will override the empty string and replace it with the default value.

#### Rule-13. Never use block I/O APIs (P.174)
The single most important rule of concurrent JavaScript is never to use any blocking I/O APIs in the middle of an application's event queue.

#### Rule-14. ```Array.isArray``` is more reliable than ```instanceof``` (P.162)
When you need to test whether an object is a true array, not just an array-like object, ```Array.isArray``` is more reliable than ```instanceof```.

Reason: In environments where there can be multiple global objects. There may be multiple copies of the standard ```Array``` constructor and prototype object. This happens in the browser, where each frame gets a separate copy of the standard library. When communicating values between frames, an array from one frame will not inherit from the ```Array.prototype``` of another frame.


#### Rule-15. Short event loop (P.187)
It is critical to keep each turn of the event loop as short as possible.
Long running event loop or function gives bad user experience in the front-end pages.

---------------------------------


### JSLint Rules
##### (based on description in ```JavaScript: The Good Parts```)
-------------

#### Rule-1. Check declaration before use (*)

Check all variables and functions will be declared before they are used or invoked.


#### Rule-2. Check object member names misspelling

Check member names of an object against a user provided annotation.
annotation example: 
```javascript
/* members doTell, iDoDeclare, mercySakes, myGoodness, ohGoOn, wellShutMyMouth */
```

#### Rule-3. Check statements end with semicolons

Check if each statement ends with a semicolon. Dangerous if there is no semicolon after a statement, because JavaScript has has a semicolon insertion mechanism and this could change the program's semantics.

#### Rule-4. Check line breaking

Check if long statements to be broken only after one of these punctuation characters or operators:
```
, . ; : { } ( [ = < > ? ! + - * / % ~ ^ | &
== != <= >= += -= *= /= %= ^= |= &= << >> || &&
=== !== <<= >>= >>> >>>=
```
JSLint does not expect to see a long statement broken after an identifier, a string, a number, a closer, or a suffix operator:
```
) ] ++ --
```

#### Rule-5. Check Extra Comma (*)

JSLint expects to see the comma used as a separator. It does not expect to see elided elements in array literals. Extra commas should not be used. A comma should not appear after the the last element of an array literal or object literal because it can be misinterpreted by some browsers.


#### Rule-6. Required Blocks

JSLint expects that ```if``` and ```for``` statements will be made with blocks -- that is, with statements enclosed in braces(```{}```).
Under JSLint, the following statements:
```javascript
if (condition)
    statements;
```
Should be refactored into this:
```javascript
if (condition) {
    statements;
}
```

#### Rule-7. Forbidden Blocks

JSLint expects blocks with ```function```, ```if```, ```switch```, ```while```, ```for```, ```do```, and ```try``` statements and nowhere else. An exception is made for an unblocked ```if``` statement on an ```else``` or ```for in```.

#### Rule-8. Expression Statements (i.e., check for no effect statements) (*)

An expression statement is expected to be an assignment, a function/method call, or ```delete```. All other expression statements are considered errors.

#### Rule-9. ```for in``` Statement Should check ```hasOwnProperty```

The body of every ```for in``` statement should be wrapped in an ```if``` statement that does filtering.
```javascript
for (name in object) {
    if (object.hasOwnProperty(name)) {
        ...
    }
}
```

#### Rule-10. Do not use ```with``` statement

JSLint does not expect to see a ```with``` statement.


#### Rule-11. ```=``` should not appear in conditional

Do not do the following:
```javascript
if (a = b) {
    ...
}
```

#### Rule-12. ```==``` and ```!=``` is not preferred (*) 
[DLint can find the use of bitwise operations in eval]

Use ```===``` and ```!==``` to avoid implicit coercion.


#### Rule-13. Do not write unreachable code

JSLint expects that a ```return```, ```break```, ```continue```, or ```throw``` statement will be followed by a ```}``` or ```case``` or ```default```.

#### Rule-14. Confusing Pluses and Minuses

JSLint expects that ```+``` will not be followed by ```+``` or ```++```, and that ```-``` will not be followed by ```-``` or ```--```. A misplaced space can turn ```+ +``` into ```++```, an error that is difficult to see. See parentheses to avoid confusion.

#### Rule-15. Try not to use ```++``` and ```--```
Bad code practice that encouraging excessive trickiness.

#### Rule-16. Do not use Bitwise opeartions (*) 
[DLint can find the use of bitwise operations in eval]

The bitwise operations convert operands from floating-point to integers and back, so not very efficient. Also they are rarely useful in browser applications.

#### Rule-17. ```eval``` is Evil (*)
[Dlint can detect indirect use of ```eval```]

#### Rule-18. Do not use ```void```
JSLint does not expect to see ```void``` because it is confusing and not very useful.

#### Rule-19. Check regular expression related problems
JavaScript's syntax for regular expression literals overloads the ```/``` character. To avoid ambiguity, JSLint expects that the character preceding a regular expression literal is a ```(``` or ```=``` or ```:``` or ```,``` character.

#### Rule-20. Check Constructors and ```new``` (*)
JSLint enforces the convention that constructor functions be given names with initial uppercase letters. JSLint does not expect to see a function invocation with an intial uppercase name unless it has the ```new``` prefix. Also JSLint does not expect to see ```new``` prefix used with functions whose names do not start with intial uppercase.

JSLint does not expect to see the wrapper forms ```new Number```, ```new String```, or ```new Boolean```.  
JSLint does not expect to see ```new Object``` (use ```{}``` instead).  
JSLint does not expect to see ```new Array``` (use ```[]``` instead).  
[DLint's global this can partly solve this problem]

JSLint does not do any kind of global analysis. It does not attempt to determine that functions used with ```new``` are really constructors (except by enforcing capitalization conventions), or that method names are spelled correctly. (can use Jalangi to check if a function has been called with ```new``` prefix and without ```new``` prefix in the same program)

#### Rule-21. HTML related code practices

For example, all tag names must be in lowercase etc.

#### Rule-22. JSON related code practices
Check if JSON data structure are syntacically well formed.

-------------------------------


### JSHint Rules

##### All warnings
All types of JSHint errors and warnings' code and short explaination are available in the following file in this project: ```src/js/experiment/JSHintDB.js```

##### Some offcial JSHint rules and explainations are available here:
http://www.jshint.com/docs/options/#curly

##### Some other JSHint rules' detailed explainations are available here:
https://jslinterrors.com/?linter=jshint

Here lists those rules that may easily be missed by static analysis.

#### Rule-1. Freeze

This options prohibits overwriting prototypes of native objects such as Array, Date and so on.
```javascript
/* jshint freeze:true */
Array.prototype.count = function (value) { return 4; };
// -> Warning: Extending prototype of native object: 'Array'.
```

However, JSHint can not detect the following case:
```javascript
/* jshint freeze:true */
var a = Array;
a.prototype.count = function (value) { return 4; };
// -> No Warning
```


#### Rule-2. NoArg

This option prohibits the use of ```arguments.caller``` and ```arguments.callee```. Both ```.caller``` and ```.callee``` make quite a few optimizations impossible so they were deprecated in future versions of JavaScript. In fact, ECMAScript 5 forbids the use of ```arguments.callee``` in strict mode.

JSHint can detect the following case:
```javascript
function f() {
  var a = arguments.caller; 
}
```
But failed on the following case:
```javascript
function f() {
  var a = arguments;
  var b = a.caller; 
}
```

#### Rule-3. ```__iterator__``` property

This property is not supported by all browsers so use it carefully.

#### Rule-4. Invalid ```typeof``` values

Warnings about invalid typeof operator values. This operator has only a limited set of possible return values. By default, JSHint warns when you compare its result with an invalid value which often can be a typo.

```javascript
// 'fuction' instead of 'function'
if (typeof a == "fuction") { // Invalid typeof value 'fuction'
  /* ... */
}
```
Do not use this option unless you're absolutely sure you don't want these checks.

#### Rule-5. ```__proto__``` property 
Warnings about the ```__proto__``` property.

JSHint can not catch the following case.
```javascript
var prop = '__proto__';
var obj = {};
obj[prop]
```

#### Rule-6. URL starting with ```javascript:```

Warnings about the use of script-targeted URLs—such as ```javascript:```...


#### Rule-7. The array literal notation ```[]``` is preferrable
(implemented as ```UseArrObjConstrWithoutArg.js```)

Generate a warning when encounter a call to the Array constructor **preceded by the new operator with no arguments** or **more than one argument** or **a single argument that is not a number**. 

For example:
```javascript
var arr = new Array(); // generate warning
var arr2 = new Array(10); // no warning
```

Static analysis can not easily catch the following case:
```javascript
var ARRAY_ORIG = Array;
...
var arr = new ARRAY_ORIG();
```

**Source:**https://jslinterrors.com/the-array-literal-notation-is-preferrable  

#### Rule-8. The object literal notation ```{}``` is preferrable
(implemented as ```UseArrObjConstrWithoutArg.js```)


The ```The object literal notation {} is preferrable``` error (and the alternative ```Use the object literal notation {}``` and ```Use the object literal notation {} or Object.create(null)``` error) are thrown when JSLint, JSHint and ESLint encounter **a call to the Object constructor preceded by the new operator**.

For example:
```javascript
// this leads to a warning
var x = new Object();
```

Similar to the previous rule, this cannot be accurately caught by static analysis due to the limitation of alias analysis.

**Source:** https://jslinterrors.com/the-object-literal-notation-is-preferrable

#### Rule-9. Don't use octal: ```\{d}+```. Use ```'\u{d}+'``` instead
(not implement)

As of version 5 of the ECMAScript specification, octal escape sequences are deprecated and should no longer be used.

Example:
```javascript
function demo() {
    "use strict";
    // Warning: Don't use octal: '\2'. Use '\u....' instead.
    return "Copyright \251";
}
```
**Srouce:** https://jslinterrors.com/dont-use-octal-a-use-instead

#### Rule-10. Empty class in regular expression (*)
(implemented as ```EmptyClassInRegexp.js```, only report when dynamic analysis addtionally can check)

The "Empty class" error is thrown when JSLint, JSHint (only versions before 1.0.0) or ESLint encounters a regular expression literal containing an empty character class. The following example defines a regular expression including an empty character class:
```javascript
var r = /^abc[]/;
```
This error is raised to highlight code that may not work as you expect it to. According to the regular expression grammar in the ECMAScript standard, empty character classes are allowed.
However, an empty character class can never match anything, meaning the regular expression in the example above will always fail to match. Since it's unlikely you intended such behaviour, a warning is raised to highlight the fact that you may have overlooked something, or simply made a small typo.

However, static analysis may not accurately catch the following case:
```javascript
var str = "^abc[]";
...
var r = new RegExp(str);
```

**Source:** https://jslinterrors.com/empty-class

#### Rule-11. Use the isNaN function to compare with NaN
(not implement)

```javascript
var x = parseInt("myString", 10);
if (x === NaN) { // does not work
    x = 10;
}
```
**Source:** https://jslinterrors.com/use-the-isnan-function-to-compare-with-nan

#### Rule-12. Do not use {a} as a constructor

(implemented, only report when dynamic analysis addtionally can check)

This error is raised to highlight a bad practice and a piece of code that may not work as you intend it to. It can also highlight a possible fatal JavaScript error. Your code could run without error if you do not change it, but could be confusing to other developers and could also behave in unexpected ways.

```javascript
var str = new String("hello"),
    num = new Number(10),
    bool = new Boolean(false),
    math = new Math(),
    json = new JSON({ myProp: 10 });
```

The ```String```, ```Number``` and ```Boolean``` constructor functions return objects of type ```String```, ```Number``` and ```Boolean```, which is rarely what you want. Usually, you want literal string, number or boolean values, because strictly comparing an object to a literal will always return false. In the case of these objects, to fix this error, use literal values rather than their corresponding wrapper objects.

#### Rule-13. Missing radix parameter

(implemented as ```MissRadixArgInParseNum.js```, need to refine so that it only reports when dynamic analysis addtionally can check)

```javascript
parseInt("10");
// use the following instead
parseInt("10", 10);
```

**Source:** https://jslinterrors.com/missing-radix-parameter

-------------------------------


### Other Rules

Here lists other rules collected.

#### Rule-1. avoid ```document.write```
Source: http://stackoverflow.com/questions/802854/why-is-document-write-considered-a-bad-practice

Some of the potential problems of using ```document.write```:  
1. document.write (henceforth DW) does not work in XHTML  
2. DW does not directly modify the DOM, preventing further manipulation (trying to find evidence of this, but it's at best situational)  
3. DW executed after the page has finished loading will overwrite the page, or write a new page, or not work  
4. DW executes where encountered: it cannot inject at a given node point  
5. DW is effectively writing serialised text which is not the way the DOM works conceptually, and is an easy way to create bugs (.innerHTML has the same problem)  

#### Rule-2. Meaningless Assignment
This one comes from the **Bad Assignement** rule of JSHint  
Examples:
```javascript
123 = 124;
'test' = 'test2'
fun() = 123;
```

#### Rule-3. Attempting to override a constant

(not implement)  
An example:
```javascript
/*jshint esnext: true */
const MY_CONST = 10;
MY_CONST = 20; // warning here
```
This one could not be checked accurately by static analysis if the constant is passed around. But Jalangi does not support parsing ```const``` for now.

**Source:** https://jslinterrors.com/attempting-to-override-a-which-is-a-constant


#### Rule-4. Value may be overwritten in IE8 and earlier

(not implement)  
Example:
```javascript
var a = 1;
try {
    b();
} catch (a) {} // Value of 'a' may be overwritten in IE 8 and earlier.
```

**Source:** https://jslinterrors.com/value-of-a-may-be-overwritten-in-ie8

#### Rule-5. A regular expression literal can be confused with ```'/='```

(not implement)

```javascript
// A regular expression literal can be confused with '/='.
var regex =/=1123123123123123123/;
```

**Source:** https://jslinterrors.com/a-regular-expression-literal-can-be-confused-with

#### Rule-6. Spaces are hard to count in regular expression literal

(implemented as ```UncountableSpaceInRegexp.js```)

When a regular expression literal containing two or more consecutive space characters.   For example:
```javascript
// not sure how many spaces are there in the following code:
var regex = /^three   spaces$/; 
// should be refactored into the following code:
var regex = /^three {3}spaces$/;
```

**Source:** https://jslinterrors.com/spaces-are-hard-to-count-use-a


#### Rule-7. Avoid using reserved word as identifier name (*)

(removed)  
Although the existing JavaScript engine does not raise exception or warning when using the following words as identifier name, but it may causes compilation erros when in the future the JS engine start using them as keywords.

```
enum, await, implements, static, public, package, interface, protected, privated, abstract, float, short, boolean, goto, synchronized, byte, int, transient, char, long, volatile, double, native, final, let, package, yield
```

**Source:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Future_reserved_keywords  
**Source:** https://jslinterrors.com/expected-an-identifier-and-instead-saw-a-a-reserved-word  

#### Rule-8. Inconsistent call of constructor

(implemented as ```InconsistentNewCallPrefix.js```)

Sometimes call a function with ```new``` prefix, while sometimes without.

#### Rule-9. Avoid long running functions

(not implement)

Generally speaking, making the event thread unavailable to process events for any length of time (for instance, by performing lengthy processing in this thread or making it wait for something) is considered bad programming practice because it leads to (at best) an unresponsive application or (at worst) a frozen computer.


#### Rule-10. Avoid Mixing with Other Technologies

JavaScript is good for calculation, conversion, access to outside sources (Ajax) and to define the behavior of an interface (event handling). Anything else should be kept to the technology we have to do that job.
FOR EXAMPLE:
Put a red border around all fields with a class of “mandatory” when they are empty.

```javascript
var f = document.getElementById('mainform');
var inputs = f.getElementsByTagName('input');
for(var i=0,j=inputs.length;i<j;i++){
   if(inputs[i].className === 'mandatory' && inputs.value === ''){
      inputs[i].style.borderColor = '#f00';
      inputs[i].style.borderStyle = 'solid';
      inputs[i].style.borderWidth = '1px';
   }
}
```
...Two months down the line: All styles have to comply with the new company style guide, no borders are allowed and errors should be shown by an alert icon next to the element.

**Take home message:** People shouldn’t have to change your JavaScript code to change the look and feel.

```javascript
var f = document.getElementById('mainform');
var inputs = f.getElementsByTagName('input');
for(var i=0,j=inputs.length;i<j;i++){
   if(inputs[i].className === 'mandatory' && inputs.value === ''){
      inputs[i].className+=' error';
   }
}
```
Using CSS inheritance you can avoid having to loop over a lot of elements.

**Source:** http://www.thinkful.com/learn/javascript-best-practices-1/#Avoid-Mixing-with-Other-Technologies


#### Rule-11. Keep DOMAccess to a Mininum

accessing the DOM is slow because the DOM is usually an C++ object which cannot be optimized by JIT compiler. So **avoid accessing the DOM whenever possible**.

**Solution:** Write or use a helper method that batch-converts a dataset to HTML.
Seed the dataset with as much as you can and then call the method to render all out in one go.

**Source:** http://www.thinkful.com/learn/javascript-best-practices-2/#Keep-DOM-Access-to-a-Minimum


#### Rule-12. Donnot Yeild to Browser Whims

Many features are unreliable across different browsers. Need to look into more details about that...

**Source:** http://www.thinkful.com/learn/javascript-best-practices-2/#Don%E2%80%99t-Yield-to-Browser-Whims


#### Rule-13. Add Functionality with JavaScript Not Content

**If you find yourself creating lots of HTML in JavaScript, you might be doing something wrong.**

It is flasky to use ```innerHTML``` (IE has Operation Aborted error), and it is hard to keep track of the quality of the HTML you produce. If you have to add massive HTML code, load them as static HTML documents via Ajax.

**Source:** http://www.thinkful.com/learn/javascript-best-practices-2/#Add-Functionality-with-Javascript-Not-Content

#### Rule-14. Avoid ```Array.isArray```

A newcomer to JavaScript would assume that there is a simple way to see if an object is in fact an array. For the veterans out there, they know that demons are out there, especially when you are doing work that access cross frame code. Java folks have had this with class loader issues, where you get objects from different class loaders and weird things happen.

One of the common ways to re-implement ```isArray```:
```javascript
function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]'; 
}
```
**Source:** http://ajaxian.com/archives/isarray-why-is-it-so-bloody-hard-to-get-right

-------------------------------
### Other Static Checker Tools

##### ESLint https://github.com/eslint/eslint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript codeIn many ways, it is similar to JSLint and JSHint with a few exceptions:

* ESLint uses Esprima for JavaScript parsing.
* ESLint uses an AST to evaluate patterns in code.
* ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.


------------------------------
### Some Weird Parts of JavaScript

##### Sum of objects and arrays

```javascript
1 * 'foo'; //NaN
1 * 2; //2
'foo' * 1; //NaN
'foo' + 1; //'foo1'
{} + {} //NaN
[] + []; //""
[] + {}; //[object Object]
1 + 1 === 1 + 1 //true
1 + 2 === 2 + 1 //true
[] + {} === {} + [] //false
[] + {} //[object Object]
{} + {} //0
+!+[]
```
**Source:** http://www.jsfuck.com/  
**Source:** http://blog.mgechev.com/2013/02/22/javascript-the-weird-parts/


###### ```null``` is an Object

```javascript
typeof null //'object'
null instanceof Object //false
```
**Source:** http://www.smashingmagazine.com/2011/05/30/10-oddities-and-secrets-about-javascript/


###### Firefox Reads and Returns Colors in RGB, Not Hex

```javascript
var ie = navigator.appVersion.indexOf('MSIE') != -1;
var p = document.getElementById('somePara');
alert(ie ? p.currentStyle.color : getComputedStyle(p, null).color);
```

While most browsers will alert ```ff9900```, Firefox returns ```rgb(255, 153, 0)```, the RGB equivalent. Plenty of JavaScript functions are out there for converting RGB to hex.
**Source:** http://www.smashingmagazine.com/2011/05/30/10-oddities-and-secrets-about-javascript/


###### Floating point number comparison
```javascript
0.1 + 0.2 !== 0.3
```  
Maybe we can implement a checker to detect the equality comparison involving two floating numbers

**Source:** http://www.smashingmagazine.com/2011/05/30/10-oddities-and-secrets-about-javascript/
