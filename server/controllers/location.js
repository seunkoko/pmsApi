import {
  validateLocationInput,
  validateUpdateLocationInput,
} from '../middlewares/validation';
import {
  createLocation,
  getOneLocation,
  updateLocation,
} from '../middlewares/location';

const Location = require('../models').Location;
const LocationInfo = require('../models').LocationInfo;

module.exports = {
  create(req, res) {
    const locationInput = validateLocationInput(req, res);

    if (locationInput.parentLocationId) {
      Location
      .findById(parseInt(locationInput.parentLocationId))
      .then((location) => {
        if (!location) {
          return res.status(404).send({
            status: 'fail',
            data: { message: 'Parent Location not found' }
          });
        } 

        locationInput.parentLocationId = parseInt(locationInput.parentLocationId);
        locationInput.parentLocation = location.name;
        createLocation(req, res, locationInput);
      })
      .catch(error => res.status(400).send({
        status: 'fail',
        data: {
          error
        }
      }));
    } else {
      createLocation(req, res, locationInput);
    }
  },
  getOne(req, res) {
    if (isNaN(parseInt(req.query.locationId))) {
      return res.status(400).send({
        status: 'fail',
        data: {
          message: 'Parameter locationId not valid'
        }
      }); 
    }

    const locationId = parseInt(req.query.locationId);
    getOneLocation(req, res, locationId);
  },
  getAll(req, res) {
    return Location
    .all({
      include: [
        { model: LocationInfo, as: 'locationInfo', nested: 'true'}
      ],
    })
    .then(locations => {
      return res.status(200).send({
        status: 'success',
        data: {
          message: 'Locations successfully retrieved',
          locations,
        }
      });
    })
    .catch(error => res.status(400).send({
      status: 'fail',
      data: {
        error
      }
    }));
  },
  update(req, res) {
    if (isNaN(parseInt(req.query.locationId))) {
      return res.status(400).send({
        status: 'fail',
        data: {
          message: 'Parameter locationId not valid'
        }
      }); 
    }

    const locationId = parseInt(req.query.locationId);
    const locationInput = validateUpdateLocationInput(req, res);
    if (locationInput.parentLocationId) {
      Location
      .findById(parseInt(locationInput.parentLocationId))
      .then((location) => {
        if (!location) {
          return res.status(404).send({
            status: 'fail',
            data: { message: 'Parent Location not found' }
          })
        }

        locationInput.parentLocationId = parseInt(locationInput.parentLocationId);
        locationInput.parentLocation = location.name;
        updateLocation(req, res, locationId, locationInput);
      })
      .catch(error => res.status(400).send({
        status: 'fail',
        data: {
          error
        }
      }));
    } else {
      updateLocation(req, res, locationId, locationInput);
    }
  },
};
