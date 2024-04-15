const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const index = require('../db/data/test-data/index')
const endpointsData = require('../endpoints.json') 


beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    db.end();
});


describe('GET /api/topics', () => {
    test('GET 200 /api/topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
                expect(topics).toEqual(index.topicData)
            })
    });

    test('GET 404 /api/notARoute', () => {
        return request(app)
            .get('/api/notARoute')
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Not found')
            })
    });


});

describe('GET /api', () => {
    test('GET 200 /api', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            expect(body).toEqual(endpointsData)
            expect(typeof body).toBe('object')
        })
    });

    test('GET 404 /api/notARoute', () => {
        return request(app)
            .get('/api/notARoute')
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Not found')
            })
    });


});