// better to do it this way insead of hardcoding the URL
// production obviously won't use local host 
// const API_URL = 'http://localhost:8000/v1'
// make the API URL relative to where the client is hosted 
const API_URL = 'v1'

  // Load planets and return as JSON.
async function httpGetPlanets() {

  // uses planet API to retrieve all of the planets 
  const response = await fetch(`${API_URL}/planets`);
  const planets = await response.json();
  return planets;

}

  // Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {

  // uses the launches API to retrieve all of the launches 
  const response = await fetch(`${API_URL}/launches`);
  const launches = await response.json();
  
  // sorts the launches by the flight number 
  return launches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {


  try {
    // use launches API to send a post request with the launch data input by the end user 
    const response = await fetch(`${API_URL}/launches`, {
      method: 'POST',
      body: JSON.stringify(launch),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  
    // return the response from trying to add a new launch 
    return response;
  } catch(err){
    // error, server is down, etc 
    return {
      // see why we did this in useLaunches.js, line 38: const success = response.ok;
      ok: false
    }
  }
  
  
}

 // Delete launch with given ID.
async function httpAbortLaunch(id) {
  // Use the launches API to abort a launch
  try {
    const response = await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE',
    });

    return response;

  } catch(err){
    return {
      ok: false
    }
  }
  
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};