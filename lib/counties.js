var fs = require('fs');
var us = require('us');

var duplex = require('duplexify');
var request = require('request');
var toJSON = require('shp2json');

function getShapefileURL(resolution) {
  return 'http://www2.census.gov/geo/tiger/GENZ2014/shp/' + getShapefileFilename(resolution); 
}

function getShapefileFilename(resolution) {
  return 'cb_2014_us_county_' + resolution + '.zip';
}

function getCountyGeoJSONStream(resolution) {
  var url = getShapefileURL(resolution);
  return toJSON(request.get(url));
}

function getCountyGeoJSON(resolution, state, callback) {
  var countyStream = getCountyGeoJSONStream(resolution);
  var jsonS = '';
  var data;

  countyStream.on('data', function(buffer) {
    jsonS += buffer.toString();
  })
  .on('end', function() {
    data = JSON.parse(jsonS);
    if (state) {
      var fips = us.lookup(state).fips;
      var stateFeatures = data.features.filter(function(f) {
        return f.properties.STATEFP == fips;
      });
      data.features = stateFeatures;
    }
    callback(null, data);
  });
}

module.exports = {
  getCountyGeoJSON: getCountyGeoJSON
};
