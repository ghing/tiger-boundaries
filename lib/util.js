const fetch = require('node-fetch');
const shapefile = require('shapefile');
const temp = require('temp').track();
const us = require('us');
const yauzl = require("yauzl");

const DEFAULT_YEAR = 2015;

function getShapefileURL(filename, year) {
  year = year || DEFAULT_YEAR;
  return 'http://www2.census.gov/geo/tiger/GENZ' + year + '/shp/' + filename;
}

function getShapefileFilename(type, resolution, year) {
  year = year || DEFAULT_YEAR;
  return 'cb_' + year + '_us_' + type + '_' + resolution + '.zip';
}

/**
 * Fetch a shapefile and retrieve GeoJSON.
 * @param {string} url URL of zipped shapefile.
 * @returns {Promise} Promise that resolves to the GeoJSON for the shapefile.
 * @todo There are so many nested callbacks in here. Try using promises to
 * clean this up.
 */
function getGeoJSON(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => {
        // According to the README for the unzip-stream package
        // (https://github.com/mhr3/unzip-stream), the zip file format isn't
        // really meant to be processed by streaming.
        // So, save the downloaded zip file to a temporary file.
        var tempFile = temp.createWriteStream();
        tempFile.on('finish', () => {
          yauzl.open(tempFile.path, {lazyEntries: true}, (err, zipfile) => {
            let dbf, shp;

            zipfile.readEntry();

            zipfile.on("entry", (entry) => {
              // Save the entries to the .shp and .dbf files.
              if (entry.fileName.endsWith('.shp')) {
                shp = entry;
              } else if (entry.fileName.endsWith('.dbf')) {
                dbf = entry;
              }

              if (shp && dbf) {
                // We have entry objects for both the .shp and .dbf files.
                // Extract both ...
                // @todo See if there's a way to avoid these ugly nested callbacks.
                zipfile.openReadStream(shp, (err, shpReadStream) => {
                  zipfile.openReadStream(dbf, (err, dbfReadStream) => {
                    // ... and read the shapefile and convert to GeoJSON
                    resolve(shapefile.read(shpReadStream, dbfReadStream));
                  });
                });
              } else {
                // We haven't yet encountered both the .shp and .dbf files, so
                // continue through the zip files entries.
                zipfile.readEntry();
              }
            });
          });
        });
        res.body.pipe(tempFile);
      });
  });
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
  getGeoJSON: getGeoJSON,
  filterToStates: filterToStates
};
