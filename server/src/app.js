const ORIGIN_URL = 'http://localhost:3000'

// express is just a fancy listener function for the built in node http server 
const express = require('express');
const cors = require('cors');
const path = require('path');

// morgan is a HTTP request logger middleware for node.js
// Logs the HTTP requests made based on the end user's actions,
// the machine, and the browser that they're using.
const morgan = require('morgan');

//  version 1 of the api
const api_v1 = require('./routes/api-v1');

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');
const app = express();

// middleware functions:
// used for whitelisting, see notes.txt file. Only allows requests to come from
// the ORIGIN_URL
app.use(cors({
    origin: ORIGIN_URL,
}));

// use the 'combined' format for logs 
app.use(morgan('combined'));

// parses any incoming JSON from the body of incoming requests
app.use(express.json());

// serves all of the public files 
app.use(express.static(path.join(__dirname, '..', 'public')));

// version 1 of the api, this middleware function adds the v1 in front of the requests.
// for example: http://localhost:8000/v1/launches
app.use('/v1', api_v1);

// app.use('/planets', planetsRouter);
// app.use('/launches',launchesRouter);

// tells the express server what to do when it gets the all requests that start with '{domain.com}/' 
app.get('/*', (req, res) => {
    // display the index.html in the public folder when the end user 
    // sends the following request: {domain.com}/
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})
module.exports = app;