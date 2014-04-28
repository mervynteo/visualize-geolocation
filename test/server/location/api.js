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
          if (err) return done(err); // Ensure to check this in end() otherwise we wont report errors at mocha summary
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

    it('should have created document in database', function(done) {
      request(app)
        .post('/api/locations')
        .send(mockLocation)
        .expect(200)
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

    it('should respond with JSON object that is copy of newly created location', function(done) {
      request(app)
        .post('/api/locations')
        .send(mockLocation)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);

          // we can do DB wide search as we clear locatins @ before (Each)
          LocationModel.find(function(err, docs) {
            if (err) {
              return done(err);
            }

            var doc = docs[0];
            // need to cast doc._id as it will have char and num not in string but 'primitive'
            res.body.should.have.property('_id', doc._id.toString());
            res.body.should.have.property('assignedName', doc.assignedName);
            res.body.should.have.property('longitude', doc.longitude);
            res.body.should.have.property('latitude', doc.latitude);
            res.body.should.have.property('address', doc.address);
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

describe('PUT', function() {
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

    it('should update assignedName to new value', function(done) {
      request(app)
        .put('/api/locations/' + id)
        .send({updatedName: 'Bart Simpson Treehouse'})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          LocationModel.findById(id, function(err, loc) {
            loc.should.have.property('assignedName','Bart Simpson Treehouse');
          })
          done();
        });
    });

  });
});