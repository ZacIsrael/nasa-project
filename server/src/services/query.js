
const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;

// returns the skip and limit values based on the query parameters 
function getPagination(query){

    // If the limit is 0, mongo will return all of the documents
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;

    // number of values we want to skip in order to go to the following page 
    const skip = (page - 1) * limit;
    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination,
};