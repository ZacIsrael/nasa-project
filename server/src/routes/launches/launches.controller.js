// gets the launches map from the launches model 
const {  getAllLaunches, addNewLaunch, launchExists, abortLaunchById } = require('../../models/launches.models');
const { getPagination } = require('../../services/query');
async function httpGetAllLaunches(req, res){
    // req.query exposes the query paramaters  
    console.log('req.query= ', req.query);
    const { skip, limit } = getPagination(req.query);
    return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res){
    // retrieve the launch from the request's body 
    const launch = req.body;

    if(!launch.mission || !launch.rocket || 
        !launch.launchDate || !launch.target){
            // Bad request: missing necessary data 
            return res.status(400).json({
                error: 'Missing required launch properties'
            });
        }

    launch.launchDate = new Date(launch.launchDate);

    if(isNaN(launch.launchDate)){
        // The user passed an invalid date 
        return res.status(400).json({
            error: 'Invalid date'
        })
    }
    
    await addNewLaunch(launch);
    // successful creation of a launch 
    return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res){
    // the flightNumber of the launch that needs to be deleted is passed 
    // in through the request. 
    // MUST CONVERT IT TO A NUMBER 
    const flightNumber = Number(req.params.id);

    if(!flightNumber){
        // launchId is not a number 
        return res.status(400).json({
            error: 'Invalid launch id'
        })
    }
    
    if(launchExists(flightNumber)) {

        // launch exists 
        const aborted = await abortLaunchById(flightNumber)

        if(!aborted){
            // Bad request. Didn't abort the document or aborted more tha one
            return res.status(400).json({
                error: 'Launch not aborted'
            })
        }

        // successfully aborted the launch 
        return res.status(200).json({
            ok: true,
        });
    } else{
        // if launch does not exist
        return res.status(404).json({
            error: 'Launch not found'
        });
    }
 
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}