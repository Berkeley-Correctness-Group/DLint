// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // --- start loading pseudo DOM ---
    if (typeof window === 'undefined' && typeof document === 'undefined') {
    	var jsdom = require('jsdom');
    	var docStr = 
    "\
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
    	DOMParser = require('xmldom').DOMParser;
    	alert = function(msg) {}
    	document.adoptNode = function(node) {return node;};
    	document.createCDATASection = function(str) {return {};};
    	document.createNodeIterator = function(a, b, c) {return {};};
    	document.enableStyleSheetsForSet = function (name) {};
    	document.createRange = function() {};
    	document.hasFocus = function() {};
    	document.getSelection = function () {};
    }
    // --- end loading pseudo DOM ---
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
    // Get all elements that have a class of 'test'
    document.getElementsByClassName('test');
    // Get all elements that have both the 'red' and 'test' classes
    document.getElementsByClassName('red test');
    // Get all elements that have a class of 'test', inside of an element that has the ID of 'main'
    document.getElementById('para1').getElementsByClassName('test');
    // We can also use methods of Array.prototype on any HTMLCollection by passing the HTMLCollection as the method's this value. Here we'll find all div elements that have a class of 'test':
    var testElements = document.getElementsByClassName('test');
    var testDivs = Array.prototype.filter.call(testElements, function(testElement){
        return testElement.nodeName === 'DIV';
    });
})();