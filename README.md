[![Build Status](https://travis-ci.com/seunkoko/pmsApi.svg?branch=develop)](https://travis-ci.com/seunkoko/pmsApi)

# PMS API
Population Management System that contains a list of locations and the total number of residents in each location broken down by gender.

> Note: For learning purposes, you can follow the commit history of this repo.

* To use the routes, visit [PMS API](https://pms-api-staging.herokuapp.com/api)

### Features
---

* Users can create a location.
* Users can get a location.
* Users can get all locations.
* Users can edit a location.
* Users can delete a location.

**Authorization**:
No authorization required

### Endpoints
---

This is the [link](https://pms-api-staging.herokuapp.com/api) in which to access the api. 

Below are the collection of routes.


#### Location

EndPoint          |   Functionality    |    Request body/params
------------------|--------------------|--------------------------------------------------------------
POST /api/location  | Create a location   | body [name, totalFemale, totalMale, *parentLocationId]
GET /api/location   | Gets a single location | params [locationId]    
PUT /api/location   | Updates a location  | params [locationId], body [*name, *totalFemale, *totalMale, *parentLocationId]
DELETE /api/location | Deletes a location | params [locationId]
GET /api/locations  | Gets all locations |  


### Technologies Used
---

- Node.js
- Express
- Sequelize


### Installation
---

- Clone the project repository.
- Run the command below to clone:
> git clone https://github.com/seunkoko/pmsApi.git.
- Change directory into the smsApi directory.
- Install all necessary packages in the package.json file. Depending on if you are using `npm`, you can use the command below:
> npm install
- Create a postgresql database so as to supply credentials in the environment variables.
- Set environment variables according the the .env.sample file
- Run sequelize migrate command below:
> sequelize db:migrate
- Run the command below to start the application locally:
> npm run start:dev
- Test the routes above on POSTMAN or any other application of choice


#### Contributing
---

1. Fork this repository to your account.
2. Clone your repository: git clone https://github.com/seunkoko/pmsApi.git.
4. Commit your changes: git commit -m "did something".
5. Push to the remote branch: git push origin new-feature.
6. Open a pull request.

#### Licence
---

ISC

Copyright (c) 2018 Oluwaseun Owonikoko
