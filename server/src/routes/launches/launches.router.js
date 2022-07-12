const express = require('express');

// get the function(s) from the launches controller
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');
const launchesRouter = express.Router();

// will retrieve all of the launches. i.e: {domain.com}/launches/
launchesRouter.get('/', httpGetAllLaunches);

// adds a new launch to the launches map (in the real world, there will be a database )
launchesRouter.post('/', httpAddNewLaunch);

// deletes a launch
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;