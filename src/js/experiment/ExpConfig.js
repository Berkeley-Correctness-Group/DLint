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
	This module defines which warnings should be filtered
*/

(function() {
	var module = {};
	var jshintFilterList = ['Missing semicolon.'];
	var jshintFilterCodeList = [
		'W033', // missing semicomma 
		'E020', 
		'E030', 
		'E022',
		'W030', // Expected an assignment or function call and instead saw an expression.
		'W038', // '{a}' used out of scope.
		'W041', // Use '{a}' to compare with '{b}'. e.g., Use '===' to compare with 'null'.
		'W004', // '{a}' is already defined.
		'W018' // Confusing use of '{a}'.
		];
	var errorRegExp = /E\d\d\d/;
	var warningRegExp = /W\d\d\d/;

	// determine if a warning type or code from JSHint
	// should be removed (filtered)
	module.shouldRemove = function(warningStr) {
		if (jshintFilterList.indexOf(warningStr) >= 0) {
			return true;
		}
		if (jshintFilterCodeList.indexOf(warningStr) >= 0) {
			return true;
		}
		if (warningStr.match(errorRegExp)) {
			return true;
		}

		return false;
	}

	module.shouldRemove2 = function(warningStr) {
		if(warningStr === 'W033')
			return true;
		if(warningStr === 'ExeStat')
			return true;
		if(warningStr === 'Timer')
			return true;
		if(warningStr === 'FunctionAsObject')
			return true;
		return false;
	}

	module.isError = function (warningCode) {
		if (warningCode.match(errorRegExp)) {
			return true;
		}
		return false;
	}

	module.isWarning = function (warningCode) {
		if (warningCode.match(warningRegExp)) {
			return true;
		}
		return false;
	}

	module.canMatch = function (jsHintWarningCode, dlintWarningAnalysis) {
		// 'W053' only matches with 'ConstructWrappedPrimitive'
		// W053: Do not use Number as a constructor.
		if (dlintWarningAnalysis === 'ConstructWrappedPrimitive') {
			if (jsHintWarningCode === 'W053') {
				return true;
			} else {
				return false;
			}
		} else if (jsHintWarningCode === 'W053') {
			return false;
		}

		// there should be no matching of 'W058'
		// W058: Missing '()' invoking a constructor.
		if (jsHintWarningCode === 'W058') {
			return false;
		}

		// 'W009' and 'W010' only matched with 'UseArrObjConstrWithoutArg'
		// W009: The array literal notation [] is preferable.
		// W010: The object literal notation {} is preferable.
		if (jsHintWarningCode === 'W009' || jsHintWarningCode === 'W010') {
			if (dlintWarningAnalysis === 'UseArrObjConstrWithoutArg') {
				return true;
			} else {
				return false;
			}
		}

		// 'W064' only matched with 'InconsistentNewCallPrefix'
		// W064: Missing 'new' prefix when invoking a constructor.
		if (jsHintWarningCode === 'W064') {
			if (dlintWarningAnalysis === 'InconsistentNewCallPrefix') {
				return true;
			} else {
				return false;
			}
		}


		// 'W020' only matched with 'WriteArgumentsVariable'
		// W020: Read only.
		if (jsHintWarningCode === 'W020') {
			if (dlintWarningAnalysis === 'WriteArgumentsVariable') {
				return true;
			} else {
				return false;
			}
		}

		// 'W040' should not match any dlint warnings
		// W040: Possible strict violation.
		if (jsHintWarningCode === 'W040') {
			return false;
		}

		// 'W093' should not match any dlint warnings
		// W093: Did you mean to return a conditional instead of an assignment?
		if (jsHintWarningCode === 'W093') {
			return false;
		}

		// 'W019' should not match any dlint warnings
		// W019: Use the isNaN function to compare with NaN.
		if (jsHintWarningCode === 'W019') {
			return false;
		}

		// 'W120' should not match any dlint warnings
		// W120: You might be leaking a variable (j) here.
		if (jsHintWarningCode === 'W120') {
			return false;
		}

		// 'W057' should not match any dlint warnings
		// W057: Weird construction. Is 'new' necessary?
		if (jsHintWarningCode === 'W057') {
			return false;
		}

		// 'W034' should not match any dlint warnings
		// W034: Unnecessary directive \"{a}\".
		if (jsHintWarningCode === 'W034') {
			return false;
		}

		// 'W117' should not match any dlint warnings
		// W117: '{a}' is not defined.
		if (jsHintWarningCode === 'W117') {
			return false;
		}

		// 'W055' should not match any dlint warnings
		// W055: A constructor name should start with an uppercase letter.
		if (jsHintWarningCode === 'W055') {
			return false;
		}

		// 'W007' should not match any dlint warnings
		// W007: Confusing plusses.
		if (jsHintWarningCode === 'W007') {
			return false;
		}

		// 'W107' should not match any dlint warnings
		// W107: Script URL.
		if (jsHintWarningCode === 'W107') {
			return false;
		}

		// 'W069' should not match any dlint warnings
		// W069: ['{a}'] is better written in dot notation.
		// exmaple: ['pageYOffset'] is better written in dot notation.
		if (jsHintWarningCode === 'W069') {
			return false;
		}

		// 'W117' should not match any dlint warnings
		// W117: {a} is not defined
		// example: 'jQuery' is not defined.
		if (jsHintWarningCode === 'W069') {
			return false;
		}

		// 'W083' should not match any dlint warnings
		// W083: Don't make functions within a loop.
		if (jsHintWarningCode === 'W083') {
			return false;
		}

		// 'W084' should not match any dlint warnings
		// W084: Expected a conditional expression and instead saw an assignment.
		if (jsHintWarningCode === 'W084') {
			return false;
		}

		// 'W037' should not match any dlint warnings
		// W037: '{a}' is a statement label.
		// example: 'e' is a statement label.
		if (jsHintWarningCode === 'W037') {
			return false;
		}

		// 'W116' should not match any dlint warnings
		// W116: Expected '{a}' and instead saw '{b}'.
		// example: Expected '(end)' and instead saw '}'.
		if (jsHintWarningCode === 'W116') {
			return false;
		}

		// 'W032' should not match any dlint warnings
		// W032: Unnecessary semicolon.
		if (jsHintWarningCode === 'W032') {
			return false;
		}

		// 'W008' should not match any dlint warnings
		// W008: A leading decimal point can be confused with a dot: '{a}'.
		// example: A leading decimal point can be confused with a dot: '.7'.
		if (jsHintWarningCode === 'W008') {
			return false;
		}

		// 'W014' should not match any dlint warnings
		// W014: Bad line breaking before '{a}'.
		// example: Bad line breaking before ','.
		if (jsHintWarningCode === 'W014') {
			return false;
		}

		// 'W017' should not match any dlint warnings
		// W017: Bad operand.
		if (jsHintWarningCode === 'W017') {
			return false;
		}

		// 'W040' should not match with 'ShadowProtoProperty'
		// Possible strict violation.
		if (jsHintWarningCode === 'W040') {
			if (dlintWarningAnalysis === 'ShadowProtoProperty') {
				return false;
			}
		}

		// 'W021' should not match with 'FunctionAsObject'
		// W021: '{a}' is a function.
		// exmaple: 'y' is a function.
		if (jsHintWarningCode === 'W021') {
			if (dlintWarningAnalysis === 'FunctionAsObject') {
				return false;
			}
		}

		// 'W088' should not match with 'ForInArray'
		// W088: Creating global 'for' variable. Should be 'for (var {a} ...'.
		// example: Creating global 'for' variable. Should be 'for (var i ...'.
		if (jsHintWarningCode === 'W088') {
			if (dlintWarningAnalysis === 'ForInArray') {
				return false;
			}
		}

		// 'W066' should only match with 'DoubleEvaluation'
		// W066: Implied eval. Consider passing a function instead of a string.
		if (jsHintWarningCode === 'W066') {
			if (dlintWarningAnalysis === 'DoubleEvaluation') {
				return true;
			} else {
				return false;
			}
		}

		// 'W064' should not match with 'CheckNaN'
		// W064: Missing 'new' prefix when invoking a constructor.
		// it is also interesting to not filter this one
		if (jsHintWarningCode === 'W064') {
			if (dlintWarningAnalysis === 'CheckNaN') {
				return false;
			}
		}

		// 'W055' should not match with 'FunctionAsObject'
		// W055: A constructor name should start with an uppercase letter.
		if (jsHintWarningCode === 'W055') {
			if (dlintWarningAnalysis === 'FunctionAsObject') {
				return false;
			}
		}

		// 'W008' should not match with 'FunctionAsObject'
		// W008: A leading decimal point can be confused with a dot: '{a}'.
		// exmaple: A leading decimal point can be confused with a dot: '.7'.
		if (jsHintWarningCode === 'W008') {
			if (dlintWarningAnalysis === 'FunctionAsObject') {
				return false;
			}
		}

		// 'W069' should not match with 'FunctionAsObject'
		// W069: ['{a}'] is better written in dot notation.
		// example: ['jswing'] is better written in dot notation.
		if (jsHintWarningCode === 'W069') {
			if (dlintWarningAnalysis === 'FunctionAsObject') {
				return false;
			}
		}

		// 'W007' should not match with 'FunctionAsObject'
		// W007: Confusing plusses.
		if (jsHintWarningCode === 'W007') {
			if (dlintWarningAnalysis === 'FunctionAsObject') {
				return false;
			}
		}

		// 'W107' should not match with 'FunctionAsObject'
		// W107: Script URL.
		if (jsHintWarningCode === 'W107') {
			if (dlintWarningAnalysis === 'FunctionAsObject') {
				return false;
			}
		}

		// 'W064' should not match with 'FunctionCalledWithMoreArguments'
		// W064: Missing 'new' prefix when invoking a constructor.
		if (jsHintWarningCode === 'W064') {
			if (dlintWarningAnalysis === 'FunctionCalledWithMoreArguments') {
				return false;
			}
		}

		// 'W064' should not match with 'FunctionAsObject'
		// Missing 'new' prefix when invoking a constructor.
		if (jsHintWarningCode === 'W064') {
			if (dlintWarningAnalysis === 'FunctionAsObject') {
				return false;
			}
		}

		// 'W040' should not match with 'FunctionAsObject'
		// W040: Possible strict violation.
		if (jsHintWarningCode === 'W040') {
			if (dlintWarningAnalysis === 'FunctionAsObject') {
				return false;
			}
		}

		// 'W064' should not match with 'GlobalThis'
		// W064: Missing 'new' prefix when invoking a constructor.
		if (jsHintWarningCode === 'W064') {
			if (dlintWarningAnalysis === 'GlobalThis') {
				return false;
			}
		}

		// 'W055' should not match with 'FunctionCalledWithMoreArguments'
		// W055: A constructor name should start with an uppercase letter.
		if (jsHintWarningCode === 'W055') {
			if (dlintWarningAnalysis === 'FunctionCalledWithMoreArguments') {
				return false;
			}
		}
		 
		return true;
	}

	exports.module = module;
})();