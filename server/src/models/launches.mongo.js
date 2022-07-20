// schema file used for how we talk to our MongoDB collection for launches 

// importing the mongoose module, the most widely used node package for connecting to MongoDB
const mongoose = require('mongoose');

// create launches schema. Defines the type of each field in the launches collection
const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        // flightNumber is a required field 
        required: true,
    },
    launchDate: {
        type: Date,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    target: {
        type: String,
        
        // the target must reference a planet in our 'Planet" collection. not ideal for MongoDB, only good for SQL
        // type: mongoose.ObjectId,
        // ref: 'Planet'
        // required: true

    },
    upcoming: {
        type: Boolean,
        required: true,
    }, 
    success: {
        type: Boolean,
        required: true,
        // a launch will be successful by default 
        default: true
    },
    // the optional 'customers' field is an array of Strings 
    customers: [String]

});

// compiling the model: assign the 'launchesSchema' to the launches collection. 
// .model function always makes the collection name plural so 'Launch' --> 'launches'
module.exports = mongoose.model('Launch', launchesSchema);