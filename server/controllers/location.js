import {
  validateLocationInput,
  validateUpdateLocationInput,
} from '../middlewares/validation';
import {
  createLocation,
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
};
