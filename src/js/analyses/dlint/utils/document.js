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

// create a dummy document object for testing on node.js

((function(sandbox) {
	/*var docStr = "<html><head><title></title></head><body><h1>Hello YUI!</h1></body></html>";
    if (typeof document === 'undefined') {
	    var jsdom = require('jsdom');
	    var dom = jsdom.defaultLevel;
	    //Create the document
	    sandbox.document = jsdom.jsdom(docStr);
	}*/
	if (typeof document === 'undefined' && typeof window === 'undefined') {
		// --- start loading pseudo DOM ---
		var jsdom = require('jsdom');
		var docStr = "\
<!DOCTYPE html>\
<html>\
<head>\
  <title>getElementById example</title>\
  <script>\
  function changeColor(newColor) {\
    var elem = document.getElementById(\"para1\");\
    elem.style.color = newColor;\
  }\
  </script>\
</head>\
<body>\
  <p id=\"para1\">Some text here</p>\
  <button onclick=\"changeColor('blue');\">blue</button>\
  <button onclick=\"changeColor('red');\">red</button>\
</body>\
</html>\
";
		//Create the document
		document = jsdom.jsdom(docStr);
		window = document.defaultView;

		document.adoptNode = function (node) {
			return node;
		}
		// --- end loading pseudo DOM ---
	}
})(J$));