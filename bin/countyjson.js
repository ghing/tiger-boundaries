#!/usr/bin/env node

var fs = require('fs');

var parseArgs = require('minimist');

var getCountyGeoJSON = require('../').getCountyGeoJSON;

var argv = parseArgs(process.argv.slice(2));

var state = argv.state;
var resolution = argv._[0];

var out = process.stdout;

if (argv.output) {
  out = fs.createWriteStream(argv.output);
}

getCountyGeoJSON(resolution, state, function(err, data) {
  out.write(JSON.stringify(data));
});
