// ALl mongoose code will be here 

const mongoose = require('mongoose');


// url used to connect to the MongoDB NasaCluster 
const MONGO_URL = 'mongodb+srv://nasa-api:EE5EzjZ2ZoxifaId@nasacluster.jrmr0.mongodb.net/nasa?retryWrites=true&w=majority'


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


