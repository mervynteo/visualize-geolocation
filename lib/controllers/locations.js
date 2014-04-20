'use strict';

var mongoose = require('mongoose'),
    Location = mongoose.model('Location'),
    passport = require('passport');

/**
 * Create
 */
exports.create = function (req, res, next) {
  console.log(req.body);
  var newLocation = new Location(req.body); 
  // save is working when parms in Location. because names dont match schema.
  newLocation.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(400, err);
    } else {
      console.log("Location creation successful!");
      res.send(200);
    }
  });
};

/**
 *  read. need to complete this for find all.
 */
exports.show = function (req, res, next) {
  Location.find(function (err, docs) {
    if (err) return next(err);

    console.log(docs);
    res.json(docs);
  });
};

/**
 * update
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};