// schedule a launch date
// We a mission name, a rocket type, a destination exoplanet

// object used to post to and read documents from the 'launches' collection
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

// map used to store the launches 
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 0;

const testLaunchFN =  getLatestFlightNumber();
// example launch object
const testLaunch = {

    flightNumber: DEFAULT_FLIGHT_NUMBER,
    // mission name 
    mission: 'Test Mission',
    // rocket name
    rocket: 'Rocket123',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-1649 b',
    customers: ['NASA', 'ZTM'],
    // Becomes false once this launch's date has passed
    upcoming: true,
    // determines wheter or not a launch was successful
    success: true

};

// save the launch to the 'launches collection
// saveLaunch(testLaunch);


async function getLatestFlightNumber(){
    // retrieve the launch with the highest flightNumber 
    const latestLaunch = await launches
    // findOne returns the first launch in what is returned 
    // the one with the highest flightNumber because it's in descending order 
    .findOne()
    // sort by flightNumber in descending order 
    .sort('-flightNumber');

    // launches collection is empty 
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}


async function getAllLaunches(){
    // retrieve all the documents from the launches collection
    return await launches.find({}, {
        // exclude the version and id of each launch when retrieving them
        '_id': 0,
        '__v': 0
    });
}

async function saveLaunch(launch){
    // manual referential integrity (verify that it planet with that keplerName exists in the planets collection)
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    console.log('planet= ', planet)

    if(!planet){
        throw new Error('The destination planet selected does not exist');
    }

    // findOneAndUpdate only returns the properties that are set in the update (in the launch object)
    await launches.findOneAndUpdate({
        // filter to find if a launch with this flight number already exists in the launches collection
        flightNumber: launch.flightNumber
    }, launch, {
        // add the launch if it does not exist
        upsert: true
    });
}

async function addNewLaunch(launch){
    // calculate the next flightNumber
    const nextFlightNum = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        // fields added to the launch object
        flightNumber: nextFlightNum,
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA']
    });

    // save the new launch to the launches collection 
    await saveLaunch(newLaunch);
}


// checks if a launch with the given flightNumber exists
async function launchExists(fligtNumber){
    return await launches.findOne({
        flightNumber: fligtNumber
    });
}

async function abortLaunchById(flightNumber){
    // checking if the launch exists here is redundant based on current implementation. 
    // just better ensurance 
    if(launchExists(flightNumber)){
        // retrieve the launch to be aborted
        const aborted = await launches.updateOne({
            flightNumber: flightNumber
        }, {
            // update the following fields of the flightNumber found
            upcoming: false,
            success: false
        })
        
        return aborted.modifiedCount === 1;
        // return aborted;
    } else{
        return {
            err: 'This launch does not exist'
        }
    }
}
module.exports = {
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
    launchExists
}



