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

//and of course id is handled by mongo itself already

module.exports = mongoose.model('Location', LocationSchema);