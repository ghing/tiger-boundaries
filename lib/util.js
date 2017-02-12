var duplex = require('duplexify');
var request = require('request');
var toJSON = require('shp2json');
var us = require('us');

var DEFAULT_YEAR = 2015;

function getShapefileURL(filename, year) {
  year = year || DEFAULT_YEAR;
  return 'http://www2.census.gov/geo/tiger/GENZ' + year + '/shp/' + filename;
}

function getShapefileFilename(type, resolution, year) {
  year = year || DEFAULT_YEAR;
  return 'cb_' + year + '_us_' + type + '_' + resolution + '.zip';
}

function getGeoJSONStream(url) {
  return toJSON(request.get(url));
}

function filterToStates(features, states) {
  var stateLookup = states.reduce(function(lookup, state) {
    var fips = us.lookup(state).fips;
    lookup[fips] = true;
    return lookup;
  }, {});
  return features.filter(function(f) {
    return stateLookup[f.properties.STATEFP];
  });
}

module.exports = {
  getShapefileURL: getShapefileURL,
  getShapefileFilename: getShapefileFilename,
  getGeoJSONStream: getGeoJSONStream,
  filterToStates: filterToStates
};
