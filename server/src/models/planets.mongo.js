// schema file used for how we talk to our MongoDB collection for planets  

// importing the mongoose module, the most widely used node package for connecting to MongoDB
const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
});

// compiling the model: assign the 'planetSchema' to the 'planets' collection. 
// .model function always makes the collection name plural so 'Planet' --> 'planets'
module.exports = mongoose.model('Planet', planetSchema);