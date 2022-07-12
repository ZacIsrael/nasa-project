const express = require('express');

// get the function(s) from the planets controller
const { httpGetAllPlanets } = require('./planets.controller');
const planetsRouter = express.Router();

// will retrieve all of the planets. i.e: {domain.com}/planets
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;