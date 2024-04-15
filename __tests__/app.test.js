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


describe('/api/topics', () => {
    test('GET 200 /api/topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
                expect(topics).toEqual(index.topicData)
            })
    });

});

describe('/api', () => {
    test('GET 200 /api', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
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

describe('/api/articles', () => {
    test('GET 200 /api/articles', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {

                articles.forEach((article) => {
                    expect(typeof article.article_id).toBe("number")
                    expect(typeof article.title).toBe("string")
                    expect(typeof article.topic).toBe("string")
                    expect(typeof article.author).toBe("string")
                    expect(typeof article.created_at).toBe("string")
                    expect(typeof article.votes).toBe('number')
                    expect(typeof article.article_img_url).toBe("string")
                    expect(typeof article.comment_count).toBe('number')
                    expect(typeof article.body).toBe('undefined')
                })
                expect(articles).toBeSorted({ key: "created_at", descending: true })
            })
    });
    

    test('GET 200 /api/articles/1', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { articles } }) => {
                const article = articles[0]
                expect(article.article_id).toBe(1)
                expect(article.title).toBe("Living in the shadow of a great man")
                expect(article.topic).toBe("mitch")
                expect(article.author).toBe("butter_bridge")
                expect(article.body).toBe("I find this existence challenging")
                expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
                expect(article.votes).toBe(100)
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")

            })
    });

    test('GET 400 /api/articles/:article_id', () => {
        return request(app)
            .get('/api/articles/cat')
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Invalid input')

            })
    });

    test('GET 404 /api/articles/:article_id', () => {
        return request(app)
            .get('/api/articles/69')
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Not found')

            })
    });


});