var fs = require('fs');


var filename = process.argv[2];
var raw = fs.readFileSync(filename);
var json = JSON.parse(raw);
var beautified = JSON.stringify(json, 0, 2);
fs.writeFileSync(filename, beautified);

