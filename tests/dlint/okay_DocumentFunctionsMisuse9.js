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
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
    var container;
    var newdiv;
    var txtnode;
    
    // container = document.getElementById("ContainerBox");
    newdiv = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    txtnode = document.createTextNode("This is text that was constructed dynamically with createElementNS and createTextNode then inserted into the document using appendChild.");
    newdiv.appendChild(txtnode);
    // container.appendChild(newdiv);
})();