// This file includes tests for all of the 'launches' endpoints
// jest will know to execute this file because its name ends with '.test.js'

// use to make requests against the API
const request = require('supertest');
const { response } = require('../../app');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');


describe('Launches API', () => {

    beforeAll(async () => {
        // whatever is in this call back must be run before all the tests are excuted 
        await mongoConnect();
    })

    describe('TEST GET /launches', () => {

        test('It should respond with 200 success', async () => {
            // the request requires the application's server as a parameter 
            const repsonse = await request(app)
            .get('/launches')
            // checks the the content type is an application-json 
            .expect('Content-Type', /json/)
            // we expect the status code to be 200
            .expect(200);
        })
    })

    describe('TEST POST /launches', () => {
        const completeLaunchData = {
            mission: 'Jest Test Mission',
            rocket: 'Rocket Jest 0190D',
            target: 'Kepler-62 f',
            launchDate: 'March 2, 2023'
        }

        const launchDataInvalidPlanet = {
            mission: 'Jest Test Mission',
            rocket: 'Rocket Jest 0190D',
            target: 'Mars',
            launchDate: 'March 2, 2023'
        }
        const launchDataWithoutDate = {
            mission: 'Jest Test Mission',
            rocket: 'Rocket Jest 0190D',
            target: 'Kepler-62 f',
        }

        const launchDataWithInvalidDate = {
            mission: 'Jest Test Mission',
            rocket: 'Rocket Jest 0190D',
            target: 'Kepler-62 f',
            launchDate: 'zoot'
        }
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/launches')
                // body that needs to be sent in the post request 
                .send(completeLaunchData)
                // checks the the content type is an application-json 
                .expect('Content-Type', /json/)
                // post requests return 201 on success 
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            // ensures the date is a date object and they match
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        })

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/launches')
                // body that needs to be sent in the post request 
                .send(launchDataWithoutDate)
                // checks the the content type is an application-json 
                .expect('Content-Type', /json/)
                // post requests returns 400 because there is no date property in the body
                .expect(400);

            // ensures this error message is the same one we have in our controller 
            expect(response.body).toStrictEqual({
                error: 'Missing required launch properties'
            });
        })

        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/launches')
                // body that needs to be sent in the post request 
                .send(launchDataWithInvalidDate)
                // checks the the content type is an application-json 
                .expect('Content-Type', /json/)
                // post requests returns 400 because the date is invalid 
                .expect(400);

            // ensures this error message is the same one we have in our controller 
            expect(response.body).toStrictEqual({
                error: 'Invalid date'
            });
        })
    })

    afterAll(async () => {
        // code here is executed after all the tests have finished 
        await mongoDisconnect();
    })

});