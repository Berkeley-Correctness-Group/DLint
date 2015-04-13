/*!
 * JSHint, by JSHint Community.
 *
 * This file (and this file only) is licensed under the same slightly modified
 * MIT license that JSLint is. It stops evil-doers everywhere:
 *
 *   Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)
 *
 *   Permission is hereby granted, free of charge, to any person obtaining
 *   a copy of this software and associated documentation files (the "Software"),
 *   to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom
 *   the Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included
 *   in all copies or substantial portions of the Software.
 *
 *   The Software shall be used for Good, not Evil.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 *
 */

/*
  This is the JSHint warnings and errors's code and message mapping information:
*/
(function() {
    var code, JSHintDB = {};
    var errors = {
        // JSHint options
        E001: "Bad option: '{a}'.",
        E002: "Bad option value.",

        // JSHint input
        E003: "Expected a JSON value.",
        E004: "Input is neither a string nor an array of strings.",
        E005: "Input is empty.",
        E006: "Unexpected early end of program.",

        // Strict mode
        E007: "Missing \"use strict\" statement.", // (no)
        E008: "Strict violation.",
        E009: "Option 'validthis' can't be used in a global scope.", // (yes) (implemented as global this)
        E010: "'with' is not allowed in strict mode.",  // (no)

        // Constants
        E011: "const '{a}' has already been declared.",  // (no)
        E012: "const '{a}' is initialized to 'undefined'.",
        E013: "Attempting to override '{a}' which is a constant.", // (no) (jalangi parser not support 'const' for now)

        // Regular expressions
        E014: "A regular expression literal can be confused with '/='.", // (yes) (may not be better than static analysis)
        E015: "Unclosed regular expression.", // (no)
        E016: "Invalid regular expression.", // (no)

        // Tokens
        E017: "Unclosed comment.",  // (no)
        E018: "Unbegun comment.",
        E019: "Unmatched '{a}'.",
        E020: "Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
        E021: "Expected '{a}' and instead saw '{b}'.",
        E022: "Line breaking error '{a}'.",
        E023: "Missing '{a}'.",
        E024: "Unexpected '{a}'.",
        E025: "Missing ':' on a case clause.",
        E026: "Missing '}' to match '{' from line {a}.",
        E027: "Missing ']' to match '[' from line {a}.",
        E028: "Illegal comma.",
        E029: "Unclosed string.",  // (no)

        // Everything else
        E030: "Expected an identifier and instead saw '{a}'.",
        E031: "Bad assignment.", // FIXME: Rephrase     // (partly no)
        E032: "Expected a small integer or 'false' and instead saw '{a}'.",
        E033: "Expected an operator and instead saw '{a}'.",
        E034: "get/set are ES5 features.",  // (no)
        E035: "Missing property name.",
        E036: "Expected to see a statement and instead saw a block.",
        E037: null,
        E038: null,
        E039: "Function declarations are not invocable. Wrap the whole function invocation in parens.", // (no)
        E040: "Each value should have its own case label.",
        E041: "Unrecoverable syntax error.",
        E042: "Stopping.", // (no)
        E043: "Too many errors.",
        E044: null,
        E045: "Invalid for each loop.",
        E046: "A yield statement shall be within a generator function (with syntax: `function*`)",
        E047: null, // Vacant
        E048: "Let declaration not directly within block.",
        E049: "A {a} cannot be named '{b}'.",
        E050: "Mozilla requires the yield expression to be parenthesized here.",
        E051: "Regular parameters cannot come after default parameters.",
        E052: "Unclosed template literal.",
        E053: "Export declaration must be in global scope.",
        E054: "Class properties must be methods. Expected '(' but instead saw '{a}'."
    };

    var warnings = {
        W001: "'hasOwnProperty' is a really bad name.",
        W002: "Value of '{a}' may be overwritten in IE 8 and earlier.",  // (no)
        W003: "'{a}' was used before it was defined.", // (no)
        W004: "'{a}' is already defined.",  // (no)
        W005: "A dot following a number can be confused with a decimal point.", // (no)
        W006: "Confusing minuses.", // (no)
        W007: "Confusing plusses.", // (no)
        W008: "A leading decimal point can be confused with a dot: '{a}'.", // (no)
        W009: "The array literal notation [] is preferable.", // (yes) (not implemented in DLint)
        W010: "The object literal notation {} is preferable.", //  (yes) (not implemented in DLint)
        W011: null,
        W012: null,
        W013: null,
        W014: "Bad line breaking before '{a}'.",
        W015: null,
        W016: "Unexpected use of '{a}'.", // unexpected use of bit operators (yes) (static checker is better) 
        W017: "Bad operand.",
        W018: "Confusing use of '{a}'.",
        W019: "Use the isNaN function to compare with NaN.", // (yes) (not implemented yet)
        W020: "Read only.",  // (yes) (implemented)
        W021: "'{a}' is a function.",
        W022: "Do not assign to the exception parameter.", // (no)
        W023: "Expected an identifier in an assignment and instead saw a function invocation.",
        W024: "Expected an identifier and instead saw '{a}' (a reserved word).", // (yes) (implemented in DLint)
        W025: "Missing name in function declaration.", // (no)
        W026: "Inner functions should be listed at the top of the outer function.",
        W027: "Unreachable '{a}' after '{b}'.",
        W028: "Label '{a}' on {b} statement.",
        W030: "Expected an assignment or function call and instead saw an expression.", // (no)
        W031: "Do not use 'new' for side effects.", // (no)
        W032: "Unnecessary semicolon.",  // (no)
        W033: "Missing semicolon.",
        W034: "Unnecessary directive \"{a}\".", // (no)
        W035: "Empty block.",
        W036: "Unexpected /*member '{a}'.",
        W037: "'{a}' is a statement label.", // (no)
        W038: "'{a}' used out of scope.",  // (no)
        W039: "'{a}' is not allowed.",
        W040: "Possible strict violation.",
        W041: "Use '{a}' to compare with '{b}'.",
        W042: "Avoid EOL escaping.",
        W043: "Bad escaping of EOL. Use option multistr if needed.", // (no)
        W044: "Bad or unnecessary escaping.",
        W045: "Bad number '{a}'.",
        W046: "Don't use extra leading zeros '{a}'.",
        W047: "A trailing decimal point can be confused with a dot: '{a}'.", // (no)
        W048: "Unexpected control character in regular expression.",
        W049: "Unexpected escaped character '{a}' in regular expression.",
        W050: "JavaScript URL.",
        W051: "Variables should not be deleted.", // (no)
        W052: "Unexpected '{a}'.",
        W053: "Do not use {a} as a constructor.", // (yes) (implemented constructwrappedprimitive)
        W054: "The Function constructor is a form of eval.", // (yes) (implemented in DLint)
        W055: "A constructor name should start with an uppercase letter.", // (yes) (but static is better)
        W056: "Bad constructor.", // (no)
        W057: "Weird construction. Is 'new' necessary?",
        W058: "Missing '()' invoking a constructor.", // (no)
        W059: "Avoid arguments.{a}.",  // (yes) (partly implemented in DLint)
        W060: "document.write can be a form of eval.",
        W061: "eval can be harmful.", // (yes) (implemented in DLint)
        W062: "Wrap an immediate function invocation in parens " +
            "to assist the reader in understanding that the expression " +
            "is the result of a function, and not the function itself.", // (no)
        W063: "Math is not a function.", // (yes) but JS engine will raise warnings
        W064: "Missing 'new' prefix when invoking a constructor.",
        W065: "Missing radix parameter.", // (yes) (not implemented yet)
        W066: "Implied eval. Consider passing a function instead of a string.", // (yes) (static checker is better)
        W067: "Bad invocation.",
        W068: "Wrapping non-IIFE function literals in parens is unnecessary.", // (no)
        W069: "['{a}'] is better written in dot notation.", // (no)
        W070: "Extra comma. (it breaks older versions of IE)", // (yes) (implemented in DLint)
        W071: "This function has too many statements. ({a})", // (no)
        W072: "This function has too many parameters. ({a})", // (no)
        W073: "Blocks are nested too deeply. ({a})",
        W074: "This function's cyclomatic complexity is too high. ({a})",
        W075: "Duplicate {a} '{b}'.", // (no)
        W076: "Unexpected parameter '{a}' in get {b} function.", // (no)
        W077: "Expected a single parameter in set {a} function.",
        W078: "Setter is defined without getter.",
        W079: "Redefinition of '{a}'.", // (yes) (implemented in DLint)
        W080: "It's not necessary to initialize '{a}' to 'undefined'.", // (yes) (statick checker is better)
        W081: null,   // (no)
        W082: "Function declarations should not be placed in blocks. " +
            "Use a function expression or move the statement to the top of " +
            "the outer function.", // (no)
        W083: "Don't make functions within a loop.", // (no)
        W084: "Expected a conditional expression and instead saw an assignment.", // (no)
        W085: "Don't use 'with'.", // (no)
        W086: "Expected a 'break' statement before '{a}'.",
        W087: "Forgotten 'debugger' statement?", // (no)
        W088: "Creating global 'for' variable. Should be 'for (var {a} ...'.", // (no)
        W089: "The body of a for in should be wrapped in an if statement to filter " +
            "unwanted properties from the prototype.", // (no)
        W090: "'{a}' is not a statement label.", // (no)
        W091: "'{a}' is out of scope.",
        W093: "Did you mean to return a conditional instead of an assignment?", // (no)
        W094: "Unexpected comma.",
        W095: "Expected a string and instead saw {a}.", // (?)
        W096: "The '{a}' key may produce unexpected results.",
        W097: "Use the function form of \"use strict\".", // (no)
        W098: "'{a}' is defined but never used.", // (no)
        W099: null,
        W100: "This character may get silently deleted by one or more browsers.",
        W101: "Line is too long.",
        W102: null,
        W103: "The '{a}' property is deprecated.",
        W104: "'{a}' is available in ES6 (use esnext option) or Mozilla JS extensions (use moz).",
        W105: "Unexpected {a} in '{b}'.", // (no) (but may be implemented in static analysis is better)
        W106: "Identifier '{a}' is not in camel case.", // (yes) (static checker is better)
        W107: "Script URL.",
        W108: "Strings must use doublequote.",   // (no)
        W109: "Strings must use singlequote.",   // (no)
        W110: "Mixed double and single quotes.", // (no)
        W112: "Unclosed string.", // (?)
        W113: "Control character in string: {a}.",
        W114: "Avoid {a}.",
        W115: "Octal literals are not allowed in strict mode.", // (yes) (not implemented)
        W116: "Expected '{a}' and instead saw '{b}'.",  // (no) example:  https://jslinterrors.com/option-jshint-curly
                                                        // another example: https://jslinterrors.com/option-jshint-eqeqeq
        W117: "'{a}' is not defined.",  // (?)
        W118: "'{a}' is only available in Mozilla JavaScript extensions (use moz option).", // (no)
        W119: "'{a}' is only available in ES6 (use esnext option).", // (no)
        W120: "You might be leaking a variable ({a}) here.",  // (no)
        W121: "Extending prototype of native object: '{a}'.", // (yes) (implemented in DLint)
        W122: "Invalid typeof value '{a}'",  // (no)
        W123: "'{a}' is already defined in outer scope.",  // (no)
        W124: "A generator function shall contain a yield statement.", // (no)
        W125: "This line contains non-breaking spaces: http://jshint.com/doc/options/#nonbsp", // (no)
        W126: "Grouping operator is unnecessary for lone expressions."  // (no)
    };

    // mapping from JSHint warning/error 
    // to Dlint Analysis Warning
    var mappingH2D = {
        W070: "ExtraCommaInArrayLiteral",           // W070: "Extra comma. (it breaks older versions of IE)"
        W121: "AddEnumerablePropertyToObject",      // W121: "Extending prototype of native object: '{a}'.",
        W020: "WriteArgumentsVariable",             // W020: "Read only.",
        W079: "OverwriteBuiltinVariable",           // W079: "Redefinition of '{a}'.",
        W020: "OverwriteBuiltinVariable",           // W020: "Read only.", 
        W024: "ReservedWordReference",              // W024: "Expected an identifier and instead saw '{a}' (a reserved word).",
        W061: "eval can be harmful.", // (yes) (implemented in DLint)
        W054: "The Function constructor is a form of eval.", // (yes) (implemented in DLint)
        W019: "Use the isNaN function to compare with NaN.", // (yes) (not implemented yet)
        E009: "Option 'validthis' can't be used in a global scope.", // (yes) (implemented as global this)
        W066: "Implied eval. Consider passing a function instead of a string.", // (yes) (static checker is better)
        W053: "Do not use {a} as a constructor.", // (yes) (not implemented yet)
        W053: "Do not use {a} as a constructor.", // (yes) (implemented constructwrappedprimitive)
        W065: "Missing radix parameter.", // (yes) (not implemented yet)
    };
    var mappingD2H = {};
    var all = {};

    // merge the code to detail table
    // from errors and warnings into all
    for (code in errors) {
        if (!errors.hasOwnProperty(code))
            continue;
        all[code] = errors[code];
    }
    for (code in warnings) {
        if (!warnings.hasOwnProperty(code))
            continue;
        all[code] = warnings[code];
    }

    // reverse the JSHint to DLint mapping
    // we get DLint to JSHint
    for (code in mappingH2D) {
        if (!mappingH2D.hasOwnProperty(code))
            continue;
        mappingD2H[mappingH2D[code]] = code;
    }

    JSHintDB.errors = errors;
    JSHintDB.warnings = warnings;
    JSHintDB.mappingH2D = mappingH2D;
    JSHintDB.mappingD2H = mappingD2H;
    JSHintDB.all = all;

    exports.JSHintDB = JSHintDB;
})();