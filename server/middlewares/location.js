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
  updateLocation: (req, res, locationId, locationInput) => {
    return LocationInfo
    .find({
      where: { locationId: locationId },
      include:  [
        { model: Location, as: 'locationInfo', }
      ],
    })
    .then(locationInfo => {
      if (!locationInfo) {
        return res.status(404).send({
          status: 'fail',
          data: {
            message: 'Location not found',
          }
        });
      }

      if (locationInput.parentLocationId && locationInput.parentLocationId === locationId) {
        return res.status(400).send({
          status: 'fail',
          data: {
            message: 'Location cannot be its own parent',
          }
        });
      }

      const location = locationInfo.dataValues.locationInfo;
      const name = locationInput.name || location.name;
      const totalFemale = locationInput.totalFemale || locationInfo.totalFemale;
      const totalMale = locationInput.totalMale || locationInfo.totalMale;
      const totalPopulation = totalFemale + totalMale;
      const parentLocationId = locationInput.parentLocationId || locationInfo.parentLocation;

      location.set('name', name);
      location.save()

      locationInfo.set('totalFemale', totalFemale);
      locationInfo.set('totalMale', totalMale);
      locationInfo.set('totalPopulation', totalPopulation);
      locationInfo.set('parentLocation', parentLocationId);
      locationInfo.save();

      return res.status(200).send({
        status: 'success',
        data: {
          message: 'Location updated successfully',
          location: {
            ...locationInfo.dataValues,
            parentLocation: locationInput.parentLocation,
            parentLocationId: parentLocationId,
          }
        }
      });
    })
    .catch((error) => res.status(400).send({
      status: 'fail',
      data: {
        error
      }
    }));
  },
};