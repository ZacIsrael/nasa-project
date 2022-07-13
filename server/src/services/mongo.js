// ALl mongoose code will be here 

const mongoose = require('mongoose');

require('dotenv').config();

// url used to connect to the MongoDB NasaCluster 
const MONGO_URL = process.env.MONGO_URL;


// Event emitter that emits events when the connection is ready 
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

// errors
mongoose.connection.on('error', (err) => {
    console.log('err= ', err)
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    // disconnect from the database
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}


