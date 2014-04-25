'use strict';

var mongoose = require('mongoose'),
    Location = mongoose.model('Location'),
    passport = require('passport');

/**
 * Create
 */
exports.create = function (req, res, next) {
  var newLocation = new Location(req.body); 
  // save is working when parms in Location. because names dont match schema.
  newLocation.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(400, err);
    }
      console.log("\nLocation creation successful!");
      res.send(200);
    
  });
};

/**
 *  READ. does for all, need to do for single location too.
 */
exports.show = function (req, res, next) {
  Location.find(function (err, docs) {
    if (err) {
      return next(err);
    }
    res.json(200, docs);
  });
};

exports.showId = function(req, res, next) {
  Location.findById(req.params.id, function(err, loc) {
    if (err) {
      next(err);
    } else if (loc === null) { // if we dont find location
      next();
    } else {
      res.json(200, loc);
    }
  });
};

exports.remove = function (req, res, next) {
  Location.findById(req.params.id, function(err, loc) {
    if (err) {
      next(err);
    } else if (loc === null) { // if we dont find location
      next();
    } else {
      return loc.remove(function(err) {
        if (err) {
          console.log(err);
          next(err);
        }
        console.log('\nLocation removed:');
        console.log(loc);
        res.send(200, req.params.id + " was removed successfully");
      });
    }
  });
};

exports.updateName = function(req, res, next) {
  var updatedName = String(req.body.updatedName); //need to determine if addr is updated too

  Location.findById(req.params.id, function(err, loc) {
    if (err) {
      next(err);
    } else if (loc === null) {
      next();
    } else {
      console.log("\n New updated name: "+updatedName);
      loc.assignedName = updatedName;
      loc.save(function(err) {
        if (err) {
          return res.send(400);
        }
        res.send(200);
      });
    }
  });
};