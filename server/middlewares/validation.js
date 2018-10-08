const validateHeader = (req, res) => {
  const header = 'content-type' in req.headers ? req.headers['content-type'].toLowerCase() : null
  if (header !== 'application/json') {
    return res.status(400)
      .send({
        status: 'fail',
        data: {
          message: 'Request Header not set',
        }
      });
  }
}

module.exports = {
  validateUpdateLocationInput: (req, res) => {
    const totalFemaleTest = 'totalFemale' in req.body ? /^[0-9]+$/.test(req.body.totalFemale) : true;
    const totalMaleTest = 'totalMale' in req.body ? /^[0-9]+$/.test(req.body.totalMale) : true;
    const parentLocationId = 'parentLocationId' in req.body ? /^[0-9]+$/.test(req.body.parentLocationId) : true;
    if (!parentLocationId) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Parent Location Id (parentLocationId) is not valid'
          }
        });
    }
    if (!totalFemaleTest) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Total female (totalFemale) must be a number'
          }
        });
    }
    if (!totalMaleTest) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Total male (totalMale) must be a number'
          }
        });
    }
    req.locationInput = {
      name: 'name' in req.body ? req.body.name.toString() : null,
      parentLocationId: 'parentLocationId' in req.body ? req.body.parentLocationId : null,
      totalFemale: 'totalFemale' in req.body ? parseInt(req.body.totalFemale) : 0,
      totalMale: 'totalMale' in req.body ? parseInt(req.body.totalMale) : 0,
    };
    return req.locationInput;
  },
  validateLocationInput: (req, res) => {
    validateHeader(req, res);
    const totalFemaleTest = 'totalFemale' in req.body ? /^[0-9]+$/.test(req.body.totalFemale) : true;
    const totalMaleTest = 'totalMale' in req.body ? /^[0-9]+$/.test(req.body.totalMale) : true;
    const parentLocationId = 'parentLocationId' in req.body ? /^[0-9]+$/.test(req.body.parentLocationId) : true;
    if (!req.body.name) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Name (name) field is required'
          }
        });
    }
    if (!parentLocationId) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Parent Location Id (parentLocationId) is not valid'
          }
        });
    }
    if (!totalFemaleTest) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Total female (totalFemale) must be a number'
          }
        });
    }
    if (!totalMaleTest) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Total male (totalMale) must be a number'
          }
        });
    }
    req.locationInput = {
      name: req.body.name.toString(),
      parentLocationId: 'parentLocationId' in req.body ? req.body.parentLocationId : null,
      totalFemale: 'totalFemale' in req.body ? parseInt(req.body.totalFemale) : 0,
      totalMale: 'totalMale' in req.body ? parseInt(req.body.totalMale) : 0,
    };
    return req.locationInput;
    return req.contactInput;
  },
};