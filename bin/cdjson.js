#!/usr/bin/env node

var fs = require('fs');

var parseArgs = require('minimist');

var getCongressionalDistrictGeoJSON = require('../').getCongressionalDistrictGeoJSON;

var argv = parseArgs(process.argv.slice(2));

var resolution = argv._[0];
var congress = argv._[1];
var state = argv.state;

var out = process.stdout;

if (argv.output) {
  out = fs.createWriteStream(argv.output);
}

if (typeof state == 'string') {
  state = [state];
}

getCongressionalDistrictGeoJSON(resolution, congress, state, function(err, data) {
  out.write(JSON.stringify(data));
});
