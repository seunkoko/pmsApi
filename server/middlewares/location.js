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
  getOneLocation: (req, res, locationId) => {
    return Location
    .findById(locationId)
    .then(location => {
      if (!location) {
        return res.status(404).send({
          status: 'fail',
          data: {
            message: 'Location not found',
          }
        });
      }

      return LocationInfo
        .find({
          where: { locationId: location.dataValues.id },
          include: [
            { model: Location, as: 'parent',}
          ],
        })
        .then((locationInfo) => {
          if (!locationInfo) {
            return res.status(404).send({
              status: 'fail',
              data: {
                message: 'Location information not found for this location, please update',
                location: {}
              }
            })
          }

          return res.status(200).send({
            status: 'success',
            data: {
              message: 'Location successfully retrieved',
              location: {
                ...locationInfo.dataValues,
                name: location.name
              },
            }
          })
        })
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