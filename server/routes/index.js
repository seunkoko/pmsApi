const locationController = require('../controllers').location;

const routes = {
  'api': 'GET /api - root url to display all routes for the PMS api',
  'create location': 'POST /api/location - body [name, totalFemale, totalMale, ^parentLocationId]',
  'get single location': 'GET /api/location - params [locationId]',
  'update single location': 'PUT /api/location - params [locationId], body [name, totalFemale, totalMale, parentLocationId]',
  'delete location': 'DELETE /api/location - params [locationId]',
  'get all locations': 'GET /api/locations',
}

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the PMS API!',
    routes,
  }));

  app
    .route('/api/location')
    .post(locationController.create)
    .get(locationController.getOne)
    .put(locationController.update)
    .delete(locationController.delete)

  app
    .route('/api/locations')
    .get(locationController.getAll)
};
