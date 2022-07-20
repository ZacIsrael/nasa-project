
// package used to help keep secrets 
require('dotenv').config();

// set the PORT as the parameter or default it to 8000
const PORT = process.env.PORT || 8000;

// importing the mongoose module, the most widely used node package for connecting to MongoDB
const mongoose = require('mongoose');

// the application 
const app = require('./app');

// in a real world application, always use https instead because it is secure 
const http = require('http');
// create the server with the application 
const server = http.createServer(app);



const { loadPlanetsData } = require('./models/planets.models');
const { loadLaunchesData } = require('./models/launches.models');
const { mongoConnect } = require('./services/mongo');


async function startServer(){
    // connect to MongoDB
    mongoConnect();

    // awaiting this function ensures that the planets data is available for any 
    // request that comes to the server 
    await loadPlanetsData();

    // awaiting this function ensures that the launches data is available for any 
    // request that comes to the server 
    await loadLaunchesData();

    // have the server listen on the specified PORT 
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });

}

startServer();
