// About MDN by Mozilla Contributors is licensed under CC-BY-SA 2.5.
// Code copied from MDN wiki page:
(function() {
    // --- start loading pseudo DOM ---
    if (typeof window === 'undefined' && typeof document === 'undefined') {
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
    	DOMParser = require('xmldom').DOMParser;
    	alert = function(msg) {}
    
    	document.adoptNode = function(node) {
    		return node;
    	};
    
    	document.createCDATASection = function(str) {
    		return {};
    	};
    
    	document.createNodeIterator = function(a, b, c) {
    		return {};
    	};
    
    	document.enableStyleSheetsForSet = function (name) {};
    
    	document.createRange = function() {};
    }
    // --- end loading pseudo DOM ---
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/open
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/close
    // open a document to write to it.
    // write the content of the document.
    // close the document.
    document.open();
    // document.write("<p>The one and only content.</p>");
    document.close();
})();