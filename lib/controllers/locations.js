'use strict';

var mongoose = require('mongoose'),
    Location = mongoose.model('Location'),
    passport = require('passport');

/**
 * Create
 */
exports.create = function (req, res, next) {
  var newLocation = new Location(req.body);
  newUser.save(function(err) {
    if (err) {
      return res.json(400, err);
    } else {
      console.log("Location creation successful: " + req.body);
    }
  });
};

/**
 *  read
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
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