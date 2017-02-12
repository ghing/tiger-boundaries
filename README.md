tiger-boundaries
================

Node package and command line tool for generating GeoJSON from U.S. Census Bureau [Cartographic Boundary Shapefiles](https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html).

At it's bare bones, it downloads the counties shapefile, converts it to GeoJSON and (optionally) filters the counties to a particular state. 

This is designed to be called from an npm script to help build data for other packages.

Installation
------------

    npm install https://github.com/ghing/census-boundaries

Get GeoJSON of counties
-----------------------

### API

    var getCountyGeoJSON = require('tiger-boundaries').getCountyGeoJSON;
    
    getCountyGeoJSON('500k', ['IA'], function(err, data) {
      console.log(JSON.stringify(data));
    });

### Command Line

    countyjson 500k --state IA > iowa.json

Get GeoJSON of congressional districts
--------------------------------------

### API

    var getCongressionalDistrictGeoJSON = require('tiger-boundaries').getCongressionalDistrictGeoJSON;

    getCongressionalDistrictGeoJSON('500k', '114', ['IL'], function(err, data) {
      console.log(JSON.stringify(data));
    });

### Command Line

    cdjson 500k 114 --state IL > cd_illinois.json
