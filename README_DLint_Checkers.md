##DLint Checkers
Generated on Sun Jan 25 2015 20:12:27 GMT-0800 (PST)

**Summary**: 23x <span style='background-color:LawnGreen'>NeedDynamic</span>, 9x <span style='background-color:Gold'>MayNeedDynamic</span>, 29x <span style='background-color:LightBlue'>SingleEventPattern</span>, 2x <span style='background-color:LightCyan'>MultiEventPattern</span>, 4x <span style='background-color:Coral'>CanCheckStatically</span>, 7x <span style='background-color:IndianRed'>Obsolete</span>

--------
#### Chk-1. CheckNaN
Find operations that result in NaN (not a number).

To reduce false positives, attempts to check if NaNs propagate to the DOM (optionally, currently disabled).

*Pattern:*
```
unOp(*,val,NaN) WHERE val \neq NaN ORR
binOp(*,left,right,NaN) WHERE left \neq NaN AND right \neq NaN ORR
call(*,*,args,NaN,*) WHERE NaN \notin args
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-2. CompareFunctionWithPrimitives
Find comparisons of a function with a primitive.

May be problematic if the developer intended to call the function before comparison.

*Pattern:*
```
binOp(relOrEqOp,left,right,*) WHERE isFct(left) AND isPrim(right) ORR
binOp(relOrEqOp,left,right,*) WHERE isPrim(left) AND isFct(right)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-3. ConcatUndefinedToString
Find code that concatenates a string and undefined.

*Pattern:*
```
binOp(+,left,right,res) WHERE (left = undefined OR right = undefined) AND isString(res)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-4. ConstructWrappedPrimitive2
Finds calls of constructors that wrap a primitive into an Object, such as 'new Number()'.

Warns only if the wrapped primitive leads to result of a binary operation that
is different from what the non-wrapped primitive would yield.

*Pattern:*
```
cond(val) WHERE isBool(val) AND val.valueOf() = false
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-5. DoubleEvaluation
Find calls of eval() and its evil twins.

Warns about:

* direct and indirect call of 'eval' function
* call of 'Function' function
* call of 'document.write': document.write can be a form of eval
* pass to 'setTimeout' or 'setInterval' a string instead of a function
(this is another form of calling eval).

*Pattern:*
```
call(builtin,eval,*,*,*) ORR
call(builtin,Function,*,*,*) ORR
call(builtin,setTimeout,args,*,*) WHERE isString(args[0]) ORR
call(builtin,setInterval,args,*,*) WHERE isString(args[0]) ORR
call(document,write,*,*,*)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-6. FloatNumberEqualityComparison
Find equality comparison between two floating point numbers.

In JavaScript ```0.1 + 0.2``` does not equal to ```0.3``` due to floating point rounding.
This checker tries to identify any statement of the form
```javascript
val == val2
val != val2
val === val2
val !== val2
```
where ```val``` and ```val2``` are both numbers, one of which is a float and their difference
is smaller than a threshold.


*Pattern:*
```
binOp(eqOp,left,right,*) WHERE isFloat(left) AND isFloat(right) AND |left-right| < \epsilon
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-7. ForInArray
Find code that iterates over an array with for .. in.

It should be avoided because:

 * using a normal for-loop is faster
 * for .. in includes properties that some library may have added to Array.prototype
 * programmers may expect to iterate over the elements instead of the indices

*Pattern:*
```
forIn(val) WHERE isArray(val)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-8. FunctionCalledWithMoreArguments
Find functions that are called with more arguments than expected by the function.

Checks for the number of formal parameters of a function and
for whether the function accesses the 'arguments' variable.

*Pattern:*
```
call(*,*,args,*,*) WHERE |args| > |\mbox{formal params. of callee}| AND \nexists~ varRead(arguments,*)~\mbox{during the call}
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightCyan'>MultiEventPattern</span>

--------
#### Chk-9. FunctionToString
Find calls of Function.toString().

The value returned by Function.toString() is only vaguely
defined in the language specification and depends on the JavaScript engine.

*Pattern:*
```
call(base,toString,*,*,*) WHERE isFct(base)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-10. GlobalThis
Find code that refers to 'this' even though 'this' is the global object.

When 'this' is the global object, there is not need to use 'this' (and it maybe unintended).

*Pattern:*
```
varRead(this,global)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-11. InconsistentConstructor
Find accesses of the 'constructor' property that do not yield the function that has created the object.

This may occur, e.g., if a developer forgets to set the 'constructor' field of a subclass.

*Pattern:*
```
propRead(base,constructor,val) WHERE val \neq \mbox{function that has created}~base
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-12. InconsistentNewCallPrefix
Find inconsistent usages of constructor functions.

Warns if a function is called both with and without the 'new' keyword.

*Pattern:*
```
call(*,f,*,*,false) AND call(*,f,*,*,true)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightCyan'>MultiEventPattern</span>

--------
#### Chk-13. NoEffectOperation
Find property writes that have no effect.

Excludes the following situations:

 * set property to primitive values (checked by another checker)
 * set NaN as property value, as NaN !== NaN
 * set property to CSS objects, as the browser engine will automatically reformat the content
 

*Pattern:*
```
propWrite(base,name,val) WHERE base.name \neq val~\mbox{after the write}
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-14. NonNumericArrayProperty
Find code that reads or writes a non-numeric array property.

Ignores properties that are defined in Array.prototype.

*Pattern:*
```
(propWrite(base,name,*) OR propRead(base,name,*)) WHERE isArray(base) AND !isNumeric(name) AND name \notin arrayProps)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-15. NonObjectPrototype
Find code that sets the 'prototype' property to a non-object.

Prototypes must always be objects.

*Pattern:*
```
propWrite(*,name,val) WHERE name \in \{prototype, \_\_proto\_\_\} AND !isObject(val)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-16. OverFlowUnderFlow
Find numerical overflows and underflows.

Looks for arithmetic operations where a finite value results in
an infinite value.

*Pattern:*
```
unOp(*,val,\infty) WHERE val \neq \infty ORR
binOp(*,left,right,\infty) WHERE left \neq \infty AND right \neq \infty ORR
call(builtin,*,args,\infty,*) WHERE \infty \notin args
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-17. OverwrittenPrototype
Find code that overwrites in existing prototype object.

Instead, the code may want to extend the existing prototype.

*Pattern:*
```
propWrite(base,name,*) WHERE name \in \{prototype, \_\_proto\_\_\} AND base.name~\mbox{is a user-defined prototype before the write}
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-18. SetFieldOfPrimitive
Find code that attempts to write a property of a primitive value.

Such code will succeed because the primitive is coerced into an object,
but the write is meaningless as it doesn't modify the primitive.

*Pattern:*
```
propWrite(base,*,*) WHERE isPrim(base)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-19. ShadowProtoProperty
Find writes of an object property that shadows a prototype property.

To reduce false warnings, ignore it if the base object of the put property
operation is a DOM HTML element.

*Pattern:*
```
propWrite(base,name,val) WHERE val~\mbox{is defined in}~ base's ~\mbox{prototype chain} AND !isFct(val) AND (base,name) \notin shadowingAllowed
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-20. ToStringGivesNonString
Find calls of 'toString()' that return a non-string.

'toString()' should always return a string.

*Pattern:*
```
call(*,toString,*,ret,*) WHERE !isString(ret)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-21. UndefinedOffset
Find code that attempts to access the 'undefined' property.

*Pattern:*
```
propWrite(*,"undefined",*) ORR
propRead(*,"undefined",*)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-22. AddEnumerablePropertyToObject
Find code that adds an enumerable property to Object.

Should be avoided because it affects every for..in loop in the program.

*Pattern:*
```
propWrite(Object,*,*) ORR
call(Object,defineProperty,args,*,*) WHERE args.length = 3 AND args[2].enumerable = true
```

<span style='background-color:Gold'>MayNeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-23. DelayedCodeString
Find strings passed to setTimeout and setInterval.

Should be avoided because it causes slowdown and because some
platforms do not support it (most browsers do, but node.js doesn't).

Superseded by newer checker 'DoubleEvaluation'.

<span style='background-color:Gold'>MayNeedDynamic</span>

--------
#### Chk-24. EmptyClassInRegexp
Find empty class in regular expression.


The following example defines a regular expression including an empty character class:

```javascript
var r = /^abc[]/;
```  
This error is raised to highlight code that may not work as you expect it to. 
According to the regular expression grammar in the ECMAScript standard, empty character 
classes are allowed. However, an empty character class can never match anything, meaning 
the regular expression in the example above will always fail to match. Since it's unlikely 
you intended such behaviour, a warning is raised to highlight the fact that you may have 
overlooked something, or simply made a small typo.

However, static analysis may not accurately catch the following case:

```javascript
var str = "^abc[]";
...
var r = new RegExp(str);
```


*Pattern:*
```
lit(val) WHERE isRegExp(val) AND val~\mbox{contains "[]"} ORR
call(builtin,RegExp,args,*,*) WHERE isString(args[0]) AND args[0]~\mbox{contains "[]"}
```

<span style='background-color:Gold'>MayNeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-25. IllegalUseOfArgumentsVariable
Find code that accesses non-existing properties of the 'arguments' variable.

*Pattern:*
```
propRead(arguments,name,*) WHERE name \notin argumentProps ORR
propWrite(arguments,*,*) ORR
call(arguments,concat,*,*,*)
```

<span style='background-color:Gold'>MayNeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-26. MissRadixArgInParseNum
Find calling ```parseInt``` function without the radix parameter.


Use of parseInt function should include a second parameter indicating
the radix, otherwise the code may have different interpretation by different people.  
```javascript
parseInt("10");
// use the following instead
parseInt("10", 10);
```


*Pattern:*
```
call(builtin,parseInt,args,*,*) WHERE args.length = 1
```

<span style='background-color:Gold'>MayNeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-27. StyleMisuse
Find code that compares a CSS object with a string.

Even though style attributes can be set as a string in HTML,
this comparison is meaningless in JavaScript because the 'style' property
is not a string and does not provide a toString() method.

*Pattern:*
```
binOp(eqOp,left,right) WHERE isCSSObj(left) AND isString(right) ORR
binOp(eqOp,left,right) WHERE isString(left) AND isCSSObj(right)
```

<span style='background-color:Gold'>MayNeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-28. UncountableSpaceInRegexp
Find multiple empty spaces in a regular expression string,
which makes the code hard to read.

It raises a warning when a regular expression literal
  contains two or more consecutive space characters.

*Pattern:*
```
(lit(val) OR call(*,RegExp,*,*,*)) WHERE isRegExp(val) AND val~\mbox{contains "~ ~"}
```

<span style='background-color:Gold'>MayNeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-29. UseArrObjConstrWithoutArg
Find use of ```Array``` and ```Object``` constructor without parameter


Try to use Array literal whenever possible
Generate a warning when encounter a call to the Array constructor 
preceded by the new operator with no arguments or more than one 
argument or a single argument that is not a number.

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
Similarly, the object literal notation {} is preferable error (and the
alternative Use the object literal notation {} and Use the object 
literal notation {} or Object.create(null) error) are thrown when 
JSLint, JSHint and ESLint encounter a call to the Object constructor 
preceded by the new operator.

For example:
```javascript
// this leads to a warning
var x = new Object();
```
Similar to the previous rule, this cannot be accurately caught by 
static analysis due to the limitation of alias analysis.


*Pattern:*
```
call(builtin,f,args,*,*) WHERE (isArray(f) OR isObject(f)) AND args.length = 0
```

<span style='background-color:Gold'>MayNeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-30. .DS_Store


--------
#### Chk-31. FunctionAsObject
Find code that uses functions as objects, i.e., code that stores properties in function objects.

It turns out that using functions as objects is common, so this checker results in many (false) warnings.

*Pattern:*
```
(propRead(base,name,*) OR propWrite(base,name,*)) WHERE isFct(base) AND name \notin expectedFctProps)
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>, <span style='background-color:IndianRed'>Obsolete</span>

--------
#### Chk-32. SimilarPropertyName
Find accesses of non-existing properties,
where a property with a similar name exists.

Intended to catch typos in property names.
Current version has many false positives; needs more work to become an effective checker.

*Pattern:*
```
propRead(base,name,val) WHERE val = undefined AND \exists~ name'~.~base.name' \neq undefined AND similar(name,name')
```

<span style='background-color:LawnGreen'>NeedDynamic</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>, <span style='background-color:IndianRed'>Obsolete</span>

--------
#### Chk-33. ConstructWrappedPrimitive
Finds calls of constructors that should not be called.

E.g., constructors that wrap primitives, such as Number().

<span style='background-color:Gold'>MayNeedDynamic</span>, <span style='background-color:IndianRed'>Obsolete</span>

--------
#### Chk-34. AccessToProto
Find accesses of the '__proto__' property.

Accessing this property is deprecated.

<span style='background-color:Coral'>CanCheckStatically</span>, <span style='background-color:IndianRed'>Obsolete</span>, <span style='background-color:LightBlue'>SingleEventPattern</span>

--------
#### Chk-35. ExtraCommaInArrayLiteral
Finds extra commas in array literals.

<span style='background-color:Coral'>CanCheckStatically</span>, <span style='background-color:IndianRed'>Obsolete</span>

--------
#### Chk-36. OverwriteBuiltinVariable
Find assignments that overwrite a built-in variable.

Built-in variables, such as 'arguments' and 'String' should not be
overwritten by any JS program.

<span style='background-color:Coral'>CanCheckStatically</span>, <span style='background-color:IndianRed'>Obsolete</span>

--------
#### Chk-37. ReservedWordReference
Find writes to local variables that have a reserved name.

Reserved names considered here include, e.g., 'enum' and 'float'.

<span style='background-color:Coral'>CanCheckStatically</span>, <span style='background-color:IndianRed'>Obsolete</span>

