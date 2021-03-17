var util = require('./util');
var getShapefileURL = util.getShapefileURL;
var getShapefileFilename = util.getShapefileFilename;
var getGeoJSON = util.getGeoJSON;
var filterToStates = util.filterToStates;


function getCountyGeoJSON(resolution, states, callback) {
  if (typeof callback == 'undefined') {
    callback = states;
    states = undefined;
  }
  var filename = getShapefileFilename('county', resolution);
  var url = getShapefileURL(filename);

  getGeoJSON(url)
    .then((data) => {
      const filtered = {...data};
      if (states) {
        filtered.features = filterToStates(filtered.features, states)
      }
      callback(null, filtered);
    });
}

module.exports = {
  getCountyGeoJSON: getCountyGeoJSON
};
