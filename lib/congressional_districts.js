var util = require('./util');
var getShapefileURL = util.getShapefileURL;
var getShapefileFilename = util.getShapefileFilename;
var getGeoJSONStream = util.getGeoJSONStream;
var filterToStates = util.filterToStates;


function getCongressionalDistrictGeoJSON(resolution, congress, states, callback) {
  if (typeof callback == 'undefined') {
    callback = states;
    states = undefined;
  }
  var filename = getShapefileFilename('cd' + congress, resolution);
  var url = getShapefileURL(filename);
  var featureStream = getGeoJSONStream(url);
  var jsonS = '';
  var data;

  featureStream.on('data', function(buffer) {
    jsonS += buffer.toString();
  })
  .on('end', function() {
    data = JSON.parse(jsonS);
    data = JSON.parse(jsonS);
    if (states) {
      data.features = filterToStates(data.features, states)
    }
    callback(null, data);
  });
}

module.exports = {
  getCongressionalDistrictGeoJSON: getCongressionalDistrictGeoJSON
};
