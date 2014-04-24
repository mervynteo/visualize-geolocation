'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'), // Look @ supertest/node_modules/superagent/docs/index.md
    mongoose = require('mongoose'),
    LocationModel = mongoose.model('Location');

var location,
    id,
    mockLocation = {
      assignedName: 'Homer Simpson',
      address: '123 Fake Street',
      longitude: 49.99,
      latitude: -140.22
    };

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
      location = new LocationModel(mockLocation);

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
            for (var postedKey in mockLocation) {
              docs[0].should.have.property(postedKey, mockLocation[postedKey]);
            }
          });
          done();
        });
    });

  });
});

describe('DELETE', function() {
  describe('/api/locations/:id', function() {

    before(function(done) {
      // Clear locations before testing
      LocationModel.remove().exec();

      location = new LocationModel(mockLocation);
      location.save();
      id = location._id;

      done();
    });

    afterEach(function(done) {
      LocationModel.remove().exec();
      done();
    });

    it('should delete document in database', function(done) {
      request(app)
        .del('/api/locations/' + id)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          // now ensure that find by id returns null
          LocationModel.findById(id, function(err, loc) {
            if (err) next(err);
            //reminder: can't use loc.should.not.be.ok as that doesnt work on null
            should.not.exist(loc);
          });
          done();
        })
    });
  });
});