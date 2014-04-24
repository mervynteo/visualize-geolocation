'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    LocationModel = mongoose.model('Location');

var location,
    id,
    mockLocation;

describe('GET', function() {
  describe('/api/locations', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/locations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          //end() is necessary, otherwise tests dont report failures! (false positive)
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });

  });

  describe('/api/locations/:id', function() {
    before(function(done) {
      location = new LocationModel({
        assignedName: 'My Bike Shop',
        address: '123 Fake Street',
        longitude: 49.001,
        latitude: -123.22
      });

      // Clear locations before testing
      LocationModel.remove().exec();
      done();
    });

    afterEach(function(done) {
      LocationModel.remove().exec();
      done();
    });

    it('should respond with object', function(done) {
      location.save();
      id = location._id;

      request(app)
        .get('/api/locations/'+id)
        .expect(200)
        //.expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          done();
        });
    });    
  });

});
// -----END of GET

describe('POST', function() {
  describe('/api/locations', function() {

    before(function(done) {
      mockLocation = {
        assignedName: 'Homer Simpson',
        address: '123 Fake Street',
        longitude: 49.99,
        latitude: -140.22
      };

      // Clear locations before testing
      LocationModel.remove().exec();
      done();
    });

    afterEach(function(done) {
      LocationModel.remove().exec();
      done();
    });

    it('should respond with 200 on success', function(done) {
      request(app)
        .post('/api/locations')
        .send(mockLocation)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should have created document in database', function(done) {
      request(app)
        .post('/api/locations')
        .send(mockLocation)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          LocationModel.find(function(err, docs) {
            if (err) {
              return done(err);
            }
            console.log(docs[0]);
            for (var postedKey in mockLocation) {
              docs[0].should.have.property(postedKey, mockLocation[postedKey]);
            }
          });
          done();
        });
    });

  });
});