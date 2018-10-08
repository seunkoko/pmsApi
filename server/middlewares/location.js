const Location = require('../models').Location;
const LocationInfo = require('../models').LocationInfo;

module.exports = {
  createLocation: (req, res, locationInput) => {
    return Location
      .create({
        name: locationInput.name
      })
      .then((location) => {

        return LocationInfo
        .create({
          locationId: location.dataValues.id,
          parentLocation: locationInput.parentLocationId,
          totalFemale: locationInput.totalFemale,
          totalMale: locationInput.totalMale,
          totalPopulation: locationInput.totalFemale + locationInput.totalMale
        })
        .then(locationInfo => res.status(201).send({
          status: 'success',
          data: {
            message: 'Location successfully created',
            location: {
              ...locationInfo.dataValues,
              parentLocation: 'parentLocation' in locationInput ? locationInput.parentLocation : null,
              parentLocationId: locationInput.parentLocationId,
              name: location.name,
            },
          }
        }))
        .catch(error => res.status(400).send({
          status: 'fail',
          data: {
            error
          }
        }));
      })
      .catch(error => res.status(400).send({
        status: 'fail',
        data: {
          error
        }
      }));
  },
};