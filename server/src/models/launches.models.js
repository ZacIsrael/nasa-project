// schedule a launch date
// We a mission name, a rocket type, a destination exoplanet

const axios = require('axios');

// object used to post to and read documents from the 'launches' collection
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

// map used to store the launches 
// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 0;

const testLaunchFN =  getLatestFlightNumber();

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


async function getAllLaunches(skip, limit){
    // retrieve all the documents from the launches collection
    return await launches.find({}, {
        // exclude the version and id of each launch when retrieving them
        '_id': 0,
        '__v': 0
    })
    // sort the returned launch documents by flightNumber: -1 = descending, 1 = ascending
    .sort({ flightNumber: 1})
    // skip tells monog how many documents to skeep before going to the next page (pagination)
    .skip(skip)
    // limit is the amount of documents per page 
    .limit(limit);
}

async function saveLaunch(launch){

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
    // manual referential integrity (verify that it planet with that keplerName exists in the planets collection)
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    console.log('planet= ', planet)

    if(!planet){
        throw new Error('The destination planet selected does not exist');
    }

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
    return await findLaunch({
        flightNumber: fligtNumber
    });
}

async function findLaunch(filter){
    // return a launch based on the filter object 
    return await launches.findOne(filter);
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

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
    // post request that is similar to get request. The query allows us to see the full 
    // object of a field that is refrenced by its id in the launche's response. 
    // See full note at the bottom of this file
    
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            // specifiy the page number
            // page: 2,
            // specify the number of launches to display per page 
            // limit: 20,
            // turn off pagination, response will be slower and larger because more data is being fetched  
            pagination: false,
            populate: [
                {
                    // Display the name of the 'rocket' field from that is being referenced
                    // in this launch response 
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    // Display the 'customers' field from the payloads object that is being 
                    // referenced in this launch response 
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    if(response.status !== 200){
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;
    // iterate through each launch returned in the "docs" array 
    for(const launchDoc of launchDocs){
        // Convert each launch returned from the SpaceX API into a launch object 
        // that agrees with the mongoDB launch schema

        const payloads = launchDoc['payloads'];
        // flatMap function gets all of the customers from all the payloads in this launch 
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        };

        console.log(`flightNumber: ${launch.flightNumber}, mission: ${launch.mission}`)

        await saveLaunch(launch);
    }
}


async function loadLaunchesData(){

    console.log('Downloading launch data from SpaceX API');
    const firstLaunch =  await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if(firstLaunch){
        console.log('Launch data has already been loaded');
        
    } 
    else {
        await populateLaunches();
    }

    
}
module.exports = {
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
    loadLaunchesData,
    launchExists
}



/*
    Note: loadLaunchData
        For example, the following body will return the name of the rocket in the launch response
        {
            "query": {},
            "options": {
                "populate": [
                    {
                        "path": "rocket",
                        "select": {
                            "name": 1
                        }
                    }
                ]
            }
        }
        if this were just a regular GET request, the launch response would only contain the rocket's unique ID 
    */