'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;  

/**
 * User Schema
 */
var LocationSchema = new Schema({
  assignedName: String,
  address: String,
  longitude: Number,
  latitude: Number
});

//and of course id is defined by mongo itself already

// ensure all fields are filled upon creation

var schemaKey = [
  'assignedName',
  'address',
  'longitude',
  'latitude'
  ];

for (var i in schemaKey) {
  LocationSchema
    .path(schemaKey[i])
    .validate(function(key) {
      return key.length;
    }, schemaKey[i] + ' value cannot be empty');
}

module.exports = mongoose.model('Location', LocationSchema);