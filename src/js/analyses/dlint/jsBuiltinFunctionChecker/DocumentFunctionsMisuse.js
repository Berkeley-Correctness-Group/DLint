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

// check for the correct use of RegExp (built-in) functions in JavaScript

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var Utils = sandbox.Utils;

        var iidToCount = {}; // iid: number --> count: number
        var iidToInfo = {}; // iid: number --> info: object
        var additionalInfo = {
            hasInfo: false,
            addMsg: function(msg) {
                this.hasInfo = true;
                this[msg] = this[msg] | 0 + 1;
            }
        };

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        // ---- function DB and check API starts ----
        var functionDB = {};

        function addEntry(name, targetFunction, checkerFunction) {
            functionDB[name] = {
                target: targetFunction,
                checker: checkerFunction
            };
        }

        function checkFunction(f, args) {
            for (var prop in functionDB) {
                if (!functionDB.hasOwnProperty(prop)) continue;
                var item = functionDB[prop];
                if (item.target === f) {
                    item.checker.apply({}, args);
                }
            }
        }

        // ---- function DB and check API ends ----

        var STRING = String;
        var REGEXP = RegExp;
        var ARRAY = Array;

        function argsToString(args) {
            var ret = '[';
            var i = 0;
            for (i = 0; i < args.length - 1; i++) {
                ret += (typeof args[i]) + ',';
            }
            if (i < args.length) {
                ret += (typeof args[i]);
            }
            ret += ']';
            return ret;
        }

        // The following functions are robust enough
        // in js engine and therefore runtime checks
        // seems unnecessary:

        // document.getElementById
        // Syntax: element = document.getElementById(id);
        addEntry('document.getElementById', document.getElementById,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.getElementById should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.getElementById should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.adoptNode
        // node = document.adoptNode(externalNode);
        addEntry('document.adoptNode', document.adoptNode,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.adoptNode should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isNode(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.adoptNode should be a HTML node. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.open
        // Syntax: document.open();
        addEntry('document.open', document.open,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.open should take only no argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.close
        // Syntax: document.close();
        addEntry('document.close', document.close,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.close should take only no argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createAttribute
        // Syntax: attribute = document.createAttribute(name)
        addEntry('document.createAttribute', document.createAttribute,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.createAttribute should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.createAttribute should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createCDATASection
        // Syntax: CDATASectionNode = document.createCDATASection(data) 
        addEntry('document.createCDATASection', document.createCDATASection,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.createCDATASection should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.createCDATASection should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createComment
        // Syntax: CommentNode = document.createComment(data) 
        addEntry('document.createComment', document.createComment,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.createComment should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.createComment should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createDocumentFragment
        // Syntax: var docFragment = document.createDocumentFragment();
        addEntry('document.createDocumentFragment', document.createDocumentFragment,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 0) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.createDocumentFragment should take no argument. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createElement
        // Syntax: var element = document.createElement(tagName);
        addEntry('document.createElement', document.createElement,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.createElement should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.createElement should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createElementNS
        // Syntax: element = document.createElementNS(namespaceURI, qualifiedName);
        addEntry('document.createElementNS', document.createElementNS,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.createElementNS should take only two arguments. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.createElementNS should be a string. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isString(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of document.createElementNS should be a string. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createEvent
        addEntry('document.createEvent', document.createEvent,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                addDebugInfo(iid, 'use of function document.createEvent is deprecated. \n Runtime Args: ' + argsToString(args));
            }
        );

        // document.createExpression
        // Syntax: xpathExpr = document.createExpression(xpathText, namespaceURLMapper);
        addEntry('document.createExpression', document.createExpression,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.createElementNS should take only two arguments. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isString(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.createElementNS should be a string. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && typeof args[1] !== 'function') {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of document.createElementNS should be a function. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createNodeIterator
        // Syntax: var nodeIterator = document.createNodeIterator(root, whatToShow, filter);
        addEntry('document.createNodeIterator', document.createNodeIterator,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 3) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function document.createNodeIterator should take only two arguments. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 1 && !Utils.isNode(args[0])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the first argument of document.createNodeIterator should be a HTML node. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 2 && !Utils.isInteger(args[1])) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the second argument of document.createNodeIterator should be a long number. \n Runtime Args: ' + argsToString(args));
                } else if (args.length >= 3 && typeof args[2] !== 'function') {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'the third argument of document.createNodeIterator should be a function. \n Runtime Args: ' + argsToString(args));
                }
            }
        );

        // document.createNSResolver
        // document.createProcessingInstruction
        // document.createRange
        // document.createTextNode
        // document.createTouchList
        // document.createTreeWalker
        // document.elementFromPoint
        // document.enableStyleSheetsForSet
        // document.evaluate
        // document.execCommand
        // document.exitPointerLock
        // document.getBoxObjectFor
        // document.getElementsByClassName
        // document.getElementsByName
        // document.getElementsByTagName
        // document.getElementsByTagNameNS
        // document.getSelection
        // document.hasFocus
        // document.importNode
        // document.loadOverlay
        // document.mozCancelFullScreen
        
        // document.queryCommandSupported
        // document.querySelector
        // document.querySelectorAll
        // document.releaseCapture
        // document.write
        // document.writeln

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            checkFunction(f, arguments);
        };

        this.endExecution = function() {
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("DocumentFunctionsMisuse", iid, location,
                    "Incorrect use of document built-in funcitons at " +
                    location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                ret.addInfo = JSON.stringify(additionalInfo);
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);