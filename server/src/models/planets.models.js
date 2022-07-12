// file system module
const fs = require('fs');
// path module
const path = require('path');
// function that allows parsing of csv files 
const { parse } = require('csv-parse');

// object used to post to and read documents from the 'planets' collection
const planets = require('./planets.mongo');

const habitablePlanets = [];

// function that determines whether a planet is habitable or not 
function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData(){

    return new Promise((resolve, reject) => {
         // reads the data from the kepler data csv strea,
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            // comments are lines that start with '#""
            comment: '#',
            // 'columns: true' returns each row in the csv file as a JavaScript object
            columns: true,
        })) // the pipe function connects the readable stream source to a writeable stream destination 
        .on('data', async (data) => {
            // for each chunk of data that comes in from the stream, execute the following code:
            if (isHabitablePlanet(data)) {
                //  if the planet is habitable, add it to the array 
                // habitablePlanets.push(data);

                savePlanet(data);

                // creates a new planet document with the specified data and adds it to the 'planets' collection
                // await planets.create({
                //     keplerName: data.kepler_name
                // });
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const planetsFound = (await getHabitablePlanets()).length;
            console.log(`${planetsFound} habitable planets found!`);
            // console.log(`${habitablePlanets.length} habitable planets found!`);
            resolve();
        });

    });

}

async function savePlanet(planet){
    try{
        // insert + update = upsert, only inserts when the document doesn't already exist 
        // inserts a new planet document with the specified data (if it does not exist) and adds it to the 'planets' collection
        await planets.updateOne({
            // filter: find the first planet with the keplerName = data.kepler_name
            keplerName: planet.kepler_name
        }, {
            // there is no planet in the collection with their keplerName = data.kepler_name so add it
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch(err){
        console.error(`Could not save planet ${err}`)
    }
}

async function getHabitablePlanets(){

    // if the filter object (first parameter) is empty, all of the planets in the collection will be returned
    return await planets.find({});

    // returns the planet(s) with the keplerName = 'test' and only displays its keplerName
    // return planets.find({
        // keplerName: 'test'
    // }, 'keplerName');
    // return habitablePlanets;
}

  module.exports = {
    loadPlanetsData,
    getHabitablePlanets
  };
