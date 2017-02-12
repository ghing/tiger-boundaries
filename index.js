var counties = require('./lib/counties');
var congressional_districts = require('./lib/congressional_districts');

module.exports = {
  getCountyGeoJSON: counties.getCountyGeoJSON,
  getCongressionalDistrictGeoJSON: congressional_districts.getCongressionalDistrictGeoJSON
};
