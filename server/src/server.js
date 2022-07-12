// set the PORT as the parameter or default it to 8000
const PORT = process.env.PORT || 8000;

// importing the mongoose module, the most widely used node package for connecting to MongoDB
const mongoose = require('mongoose');

const app = require('./app');

const http = require('http');
const server = http.createServer(app);

const { loadPlanetsData, planets } = require('./models/planets.models');
const { mongoConnect } = require('./services/mongo');


async function startServer(){
    // connect to MongoDB
    mongoConnect();

    // awaiting this function ensures that the planets data is available for any 
    // request that comes to the server 
    await loadPlanetsData();

    // have the srevr listen on the specified PORT 
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });

}

startServer();
