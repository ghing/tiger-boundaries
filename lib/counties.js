var fs = require('fs');
var us = require('us');

var util = require('./util');
var getShapefileURL = util.getShapefileURL;
var getShapefileFilename = util.getShapefileFilename;
var getGeoJSONStream = util.getGeoJSONStream;


function getCountyGeoJSON(resolution, state, callback) {
  var filename = getShapefileFilename('county', resolution);
  var url = getShapefileURL(filename);
  var countyStream = getGeoJSONStream(url);
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
