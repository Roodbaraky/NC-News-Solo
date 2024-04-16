const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const index = require('../db/data/test-data/index')
const endpointsData = require('../endpoints.json')
const { checkArticleExists } = require('../models/articles.model')


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
                expect(topics.length).toBe(3)
                topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                })
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
});

describe('/api/articles/:article_id', () => {
    describe('GET /api/articles/:article_id', () => {
        test('GET 200 /api/articles/1', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body: { article } }) => {
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
    })

    describe('PATCH /api/articles/:article_id', () => {
        test('PATCH 200 /api/articles/1', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: 1 })
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article.article_id).toBe(1)
                    expect(article.title).toBe("Living in the shadow of a great man")
                    expect(article.topic).toBe("mitch")
                    expect(article.author).toBe("butter_bridge")
                    expect(article.body).toBe("I find this existence challenging")
                    expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
                    expect(article.votes).toBe(101)
                    expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")

                })
        })
        test('PATCH 200 /api/articles/1', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: -100 })
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article.article_id).toBe(1)
                    expect(article.title).toBe("Living in the shadow of a great man")
                    expect(article.topic).toBe("mitch")
                    expect(article.author).toBe("butter_bridge")
                    expect(article.body).toBe("I find this existence challenging")
                    expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
                    expect(article.votes).toBe(0)
                    expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")

                })
        })
        test('PATCH 400 /api/articles/cat', () => {
            return request(app)
                .patch('/api/articles/cat')
                .send({ inc_votes: 1 })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        });

        test('PATCH 404 /api/articles/69', () => {
            return request(app)
                .patch('/api/articles/69')
                .send({ inc_votes: 1 })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Not found')
                })
        });
    })
})

describe('/api/articles/:article_id/comments', () => {
    describe('GET /api/articles/:article_id/comments', () => {
        test('GET 200 /api/articles/1/comments', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments.length).toBe(11)
                    comments.forEach((comment) => {
                        expect(typeof comment.comment_id).toBe('number')
                        expect(typeof comment.votes).toBe('number')
                        expect(typeof comment.created_at).toBe('string')
                        expect(typeof comment.author).toBe('string')
                        expect(typeof comment.body).toBe('string')
                        expect(typeof comment.comment_id).toBe('number')
                    })
                    expect(comments).toBeSorted({ key: 'created_at', descending: true })
                })
        });

        test('GET 404 /api/articles/69/comments', () => {
            return request(app)
                .get('/api/articles/69/comments')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Not found')
                })
        })

        test('GET 400 /api/articles/cat/comments', () => {
            return request(app)
                .get('/api/articles/cat/comments')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
    })
    describe('POST /api/articles/:article_id/comments', () => {
        test('POST 201 /api/articles/1/comments', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'I like this article'
                })
                .expect(201)
                .then(({ body: { comment } }) => {
                    expect(typeof comment).toBe('object')
                    expect(typeof comment.comment_id).toBe('number')
                    expect(typeof comment.body).toBe('string')
                    expect(typeof comment.article_id).toBe('number')
                    expect(typeof comment.author).toBe('string')
                    expect(typeof comment.votes).toBe('number')
                    expect(typeof comment.created_at).toBe('string')
                })
        })

        test('POST 400 /api/articles/cat/comments', () => {
            return request(app)
                .post('/api/articles/cat/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'I like this article'
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })

        test('POST 404 /api/articles/69/comments', () => {
            return request(app)
                .post('/api/articles/69/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'I like this article'
                })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Not found')
                })
        })
    })
})

describe('checkArticleExists', () => {
    test('should return a 404 if article_id is not present in table', () => {
        checkArticleExists(69)
            .catch((err) => {
                expect(typeof err).toBe('object')
                expect(err.msg).toBe('Not found')
                expect(err.status).toBe(404)
            })
    })

    test('should return undefined if article_id is present in table', () => {
        checkArticleExists(1)
            .then((result) => {
                expect(result).toBe(undefined)
            })
    });

    test('should return a 400 if article_id is not valid', () => {
        checkArticleExists('cat')
            .catch((err) => {
                expect(typeof err).toBe('object')
                expect(err.msg).toBe('Invalid input')
                expect(err.status).toBe(400)
            })
    });


});