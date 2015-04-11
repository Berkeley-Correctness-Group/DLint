/*
 * Copyright 2014 University of California, Berkeley.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong (gongliang13@cs.berkeley.edu)

((function(sandbox) {
    var HOP1 = Object.prototype.hasOwnProperty;
    var NumberFct = Number;
    var StringFct = String;
    var BooleanFct = Boolean;

    function HOP(obj, prop) {
        return HOP1.call(obj, prop);
    }
    var ISNAN_ORIG = isNaN;

    function compare(a, b) {
        return b.count - a.count;
    }
    var util = {
        ISNAN: function(val) {
            if (typeof val === 'number' && ISNAN_ORIG(val)) {
                if (val !== val) {
                    return true;
                }
            }
            return false;
        },
        PARSEINT: parseInt,
        isArr: function(obj) {
            return Array.isArray(obj) || (obj && obj.constructor && (obj instanceof Uint8Array || obj instanceof Uint16Array ||
                obj instanceof Uint32Array || obj instanceof Uint8ClampedArray ||
                obj instanceof ArrayBuffer || obj instanceof Int8Array || obj instanceof Int16Array ||
                obj instanceof Int32Array || obj instanceof Float32Array || obj instanceof Float64Array));
        },
        isNormalNumber: function(num) {
            if (typeof num === 'number' && !this.ISNAN(num)) {
                return true;
            } else if (typeof num === 'string' && (this.PARSEINT(num) + "" === num)) {
                return true;
            }
            return false;
        },
        isInteger: function (num) {
            if (typeof num === 'number' && !this.ISNAN(num)) {
                if(num === (num | 0)) return true;
            }
            return false;
        },
        isFloat: function (num) {
            if (typeof num === 'number' && !this.ISNAN(num)) {
                if(num !== (num | 0)) return true;
            }
            return false;
        },
        reorganizeDebugInfo: function(iidToInfo) {
            var ret = {};
            for (var iid in iidToInfo) {
                if (HOP(iidToInfo, iid)) {
                    ret[iid] = [];
                    for (var warning in iidToInfo[iid]) {
                        if (HOP(iidToInfo[iid], warning)) {
                            ret[iid].push({
                                info: warning,
                                count: iidToInfo[iid][warning]
                            });
                        }
                    }
                    ret[iid].sort(compare);
                }
            }
            return ret;
        },
        isHTMLElement: function(obj) {
            try {
                //Using W3 DOM2 (works for FF, Opera and Chrom)
                return obj instanceof HTMLElement || obj instanceof HTMLDocument;
            } catch (e) {
                //Browsers not supporting W3 DOM2 don't have HTMLElement and
                //an exception is thrown and we end up here. Testing some
                //properties that all elements have. (works on IE7)
                return (typeof obj === "object") && obj &&
                    (obj.nodeType === 1) && (typeof obj.style === "object") &&
                    (typeof obj.ownerDocument === "object");
            }
        },
        isCSSElement: function(obj) {
            if (obj && obj.constructor) {
                var str = obj.constructor.toString();
                if (str.indexOf('css') >= 0 || str.indexOf('CSS') >= 0) {
                    return true;
                }
            }
            return false;
        },
        getConstructorName: function(obj) {
            if (obj && obj.constructor) {
                if (!obj.constructor.name || obj.constructor.name === '') {
                    var str = obj.constructor.toString();
                    return str.substring(0, str.indexOf('{'));
                } else {
                    return obj.constructor.name;
                }
            } else {
                return (typeof obj);
            }
        },
        toPrimitive: function(wrapper) {
            var ret = wrapper;
            if (wrapper instanceof NumberFct) {
                ret = wrapper.valueOf();
            } else if (wrapper instanceof StringFct) {
                ret = wrapper + '';
            } else if (wrapper instanceof BooleanFct) {
                ret = wrapper.valueOf();
            }
            return ret;
        }
    };

    sandbox.Utils = util;
})(J$));