import request from 'supertest';
import chai from 'chai';
import app from '../../app';
import db from '../models';

const superRequest = request.agent(app);
const expect = chai.expect;

let testLocation1;
let testLocationInfo1;
let testLocation2;
let testLocationInfo2;

describe('LOCATION API', () => {
  before((done) => {
    db.Location.create({
      name: 'Ogun State'
    })
    .then((location1) => {
      testLocation1 = location1.dataValues;

      db.LocationInfo.create({
        locationId: testLocation1.id,
        totalFemale: 2000,
        totalMale: 5000,
        totalPopulation: 2000 + 5000
      })
      .then((locationInfo1) => {
        testLocationInfo1 = locationInfo1.dataValues;

        db.Location.create({
          name: 'Abeokuta'
        })
        .then((location2) => {
          testLocation2 = location2.dataValues;

          db.LocationInfo.create({
            locationId: testLocation2.id,
            totalFemale: 900,
            totalMale: 1000,
            totalPopulation: 900 + 1000
          })
          .then((locationInfo2) => {
            testLocationInfo2 = locationInfo2.dataValues;

            done();
          });
        });
      });
    });
  });

  after((done) => {
    db.LocationInfo.destroy({ 
      where: {}
    })
    .then(() => {
      db.Location.destroy({ where: {} })
      .then(done());
    })
  });

  describe('CREATE Location POST /api/location', () => {

    it('it should create a new location succesfully when relevant data is supplied', (done) => {
      superRequest.post('/api/location')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Akwa Ibom',
          totalMale: 3000,
          totalFemale: 10000
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Location successfully created');
          expect(res.body.data.location.name).to.equal('Akwa Ibom');
          expect(res.body.data.location.totalFemale).to.equal(10000);
          expect(res.body.data.location.totalMale).to.equal(3000);
          expect(res.body.data.location.totalPopulation).to.equal(13000);
          done();
        });
    });

    it('it should not create a new location when the name field is not supplied', (done) => {
      superRequest.post('/api/location')
        .set({ 'content-type': 'application/json' })
        .send({ 
          totalMale: 3000,
          totalFemale: 10000
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.data.message).to
            .equal('Name (name) field is required');
          done();
        });
    });

    it('it should not create a location when totalMale or totalFemale values are not supplied', (done) => {
      superRequest.post('/api/location')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Uyo',
          totalFemale: 'invalid'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.data.message).to
            .equal('Total female (totalFemale) must be a number');
          done();
        });
    });

    it('it should not create a location when totalMale or totalFemale values are not Integers', (done) => {
      superRequest.post('/api/location')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Uyo',
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Location successfully created');
          expect(res.body.data.location.name).to.equal('Uyo');
          expect(res.body.data.location.totalFemale).to.equal(0);
          expect(res.body.data.location.totalMale).to.equal(0);
          expect(res.body.data.location.totalPopulation).to.equal(0);
          done();
        });
    });

    it('it should create a location when parentLocationId is valid', (done) => {
      superRequest.post('/api/location')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Anambra',
          parentLocationId: testLocation1.id,
          totalFemale: 4916,
          totalMale: 6578
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Location successfully created');
          expect(res.body.data.location.name).to.equal('Anambra');
          expect(res.body.data.location.totalFemale).to.equal(4916);
          expect(res.body.data.location.totalMale).to.equal(6578);
          expect(res.body.data.location.parentLocationId).to.equal(testLocation1.id);
          done();
        });
    });

    it('it should not create a location when parentLocationId is invalid', (done) => {
      superRequest.post('/api/location')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Anambra',
          parentLocationId: '99999',
          totalFemale: 4916,
          totalMale: 6578
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Parent Location not found');
          done();
        });
    });
  });

  describe('GET Location GET /api/location', () => {

    it('it should get a location when the locationId is valid', (done) => {
      superRequest.get(`/api/location?locationId=${testLocation1.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Location successfully retrieved');
          expect(res.body.data.location.name).to.equal(testLocation1.name);
          expect(res.body.data.location.totalFemale).to.equal(testLocationInfo1.totalFemale);
          expect(res.body.data.location.totalMale).to.equal(testLocationInfo1.totalMale);
          expect(res.body.data.location.totalPopulation).to.equal(testLocationInfo1.totalPopulation);
          expect(res.body.data.location.locationId).to.equal(testLocation1.id);
          done();
        });
    });

    it('it should not get a location when the locationId is not a valid number', (done) => {
      superRequest.get('/api/location?locationId="invalid"')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Parameter locationId not valid');
          done();
        });
    });

    it('it should not get a location when the locationId does not exist', (done) => {
      superRequest.get('/api/location?locationId=99999')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Location not found');
          done();
        });
    });
  });

  describe('GET All Locations GET /api/locations', () => {

    it('it should get all locations successfully', (done) => {
      superRequest.get('/api/locations')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Locations successfully retrieved');
          expect(res.body.data.locations.length).to.be.greaterThan(0);
          done();
        });
    });
  });
});