// gets the planets array from the planets model 
const { getHabitablePlanets } = require('../../models/planets.models');

async function httpGetAllPlanets(req, res){
    return res.status(200).json(await getHabitablePlanets());
}

module.exports = {
    httpGetAllPlanets,
}