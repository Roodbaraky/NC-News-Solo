const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpointsData = require('../endpoints.json')
const { checkArticleExists } = require('../models/articles.model')
const { checkCommentExists } = require('../models/comments.model');
const articles = require("../db/data/test-data/articles");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    db.end();
});

describe('/api/topics', () => {
    describe('GET /api/topics', () => {
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
        test('GET 405 /api/topics - bad method', () => {
            return request(app)
                .patch('/api/topics')
                .send({})
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Bad method')
                })
        });
    })
    describe('POST /api/topics', () => {
        test('POST 201 /api/topics', () => {
            return request(app)
                .post('/api/topics')
                .send({
                    "slug": "topic name here",
                    "description": "description here"
                })
                .expect(201)
                .then(({ body: { topic } }) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                })
        })
        test('POST 201 /api/topics - ignores extra keys', () => {
            return request(app)
                .post('/api/topics')
                .send({
                    "slug": "topic name here",
                    "description": "description here",
                    "maliciouskey": 'im malicious'
                })
                .expect(201)
                .then(({ body: { topic } }) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                    expect(topic.hasOwnProperty("maliciouskey")).toBe(false)
                })
        })
        test('POST 400 /api/topics - malformed body/missing keys', () => {
            return request(app)
                .post('/api/topics')
                .send({
                    "sloog": "topic name here",
                    "desc": "description here"
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
        test('POST 400 /api/topics - missing body', () => {
            return request(app)
                .post('/api/topics')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
    })
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
    test('GET 405 /api - bad method', () => {
        return request(app)
            .post('/api')
            .send({})
            .expect(405)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad method')
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
    describe('GET /api/articles', () => {
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
        describe('GET 200 /api/articles?topic - FEATURE REQUEST', () => {
            test('GET 200 /api/articles?topic=mitch - happy path', () => {
                return request(app)
                    .get('/api/articles?topic=mitch')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        articles.forEach((article) => {
                            expect(typeof article.article_id).toBe("number")
                            expect(typeof article.title).toBe("string")
                            expect(article.topic).toBe("mitch")
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
            test('GET 400 /api/articles?tpic=mitch - bad query', () => {
                return request(app)
                    .get('/api/articles?tpic=mitch')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid input')
                    })
            });
            test('GET 404 /api/articles?topic=squidward- topic does not exist', () => {
                return request(app)
                    .get('/api/articles?topic=squidward')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not found')
                    })
            });
        })
        describe('GET 200 /api/articles?sort_by/order - FEATURE REQUEST', () => {
            test('GET 200 /api/articles?sort_by=votes - happy path', () => {
                return request(app)
                    .get('/api/articles?sort_by=votes')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({ key: "votes", descending: true })
                    })
            });
            test('GET 200 /api/articles?sort_by=comment_count - testing handling of topic =comment_count,as it is an aggregate column', () => {
                return request(app)
                    .get('/api/articles?sort_by=comment_count')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({ key: "comment_count", descending: true })
                    })
            });
            test('GET 404 /api/articles?sort_by= - column to sort_by does not exist', () => {
                return request(app)
                    .get('/api/articles?sort_by=elephant')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not found')

                    })
            });
            test('GET 200 /api/articles?order=asc - sorts in ascending order when instructed', () => {
                return request(app)
                    .get('/api/articles?order=asc')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({ descending: false })
                    })
            });
            test('GET 200 /api/articles?order=desc - do nothing, default behaviour is to sort in descening order', () => {
                return request(app)
                    .get('/api/articles?order=desc')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({ descending: true })
                    })
            });
            test('GET 400 /api/articles?order=bad - invalid order value', () => {
                return request(app)
                    .get('/api/articles?order=bad')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid input')
                    })
            });
        })
        describe('GET /api/articles?<combination> - handles multiple simultaneous queries', () => {
            test('GET 200 /api/articles?order=ASC&topic=mitch - handles 2 simultaneous queries', () => {
                return request(app)
                    .get('/api/articles?order=ASC&topic=mitch')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({ descending: false })
                        articles.forEach((article) => {
                            expect(article.topic).toBe('mitch')
                        })
                    })

            })
            test('GET 200 /api/articles?order=ASC&topic=mitch - handles multiple simultaneous queries', () => {
                return request(app)
                    .get('/api/articles?order=ASC&topic=mitch&sort_by=votes')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({ descending: false, key: 'votes' })
                        articles.forEach((article) => {
                            expect(article.topic).toBe('mitch')
                        })
                    })
            })
            test('GET 200 /api/articles?order=ASC&topic=mitch&sort_by=comment_count - handles multiple simultaneous queries', () => {
                return request(app)
                    .get('/api/articles?order=ASC&topic=mitch&sort_by=comment_count')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({ descending: false, key: 'votes' })
                        articles.forEach((article) => {
                            expect(article.topic).toBe('mitch')
                        })
                    })
            })
        })
        describe('GET /api/articles?limit=?p= - FEATURE REQUEST - PAGINATION', () => {
            test('GET 200 /api/articles?limit=10&p=1 - return 1st page only', () => {
                return request(app)
                    .get('/api/articles?limit=10&p=1')
                    .expect(200)
                    .then(({ body: { articles: { rows, totalCount } } }) => {
                        const articles = rows
                        expect(articles.length <= 10).toBe(true)
                        expect(totalCount).toBe(13)
                    })
            })
            test('GET 200 /api/articles?limit=10&p=2 - return 2nd page only', () => {
                return request(app)
                    .get('/api/articles?limit=10&p=2')
                    .expect(200)
                    .then(({ body: { articles: { rows, totalCount } } }) => {
                        const articles = rows
                        expect(articles.length === 3).toBe(true)
                        expect(totalCount).toBe(13)
                    })
            })
            test('GET 200 /api/articles?limit=10 - if just limit passed, return 1st page', () => {
                return request(app)
                    .get('/api/articles?limit=10')
                    .expect(200)
                    .then(({ body: { articles: { rows, totalCount } } }) => {
                        const articles = rows
                        expect(articles.length === 10).toBe(true)
                        expect(totalCount).toBe(13)
                    })
            })
            test('GET 200 /api/articles?p=2 - if just p passed, return p page, assuming limit=10', () => {
                return request(app)
                    .get('/api/articles?p=2')
                    .expect(200)
                    .then(({ body: { articles: { rows, totalCount } } }) => {
                        const articles = rows
                        expect(articles.length === 3).toBe(true)
                        expect(totalCount).toBe(13)
                    })
            })
            test('GET 200 /api/articles?p=2&topic=mitch - totalCount changes re:other filters', () => {
                return request(app)
                    .get('/api/articles?p=2&topic=mitch')
                    .expect(200)
                    .then(({ body: { articles: { rows, totalCount } } }) => {
                        const articles = rows
                        expect(articles.length === 2).toBe(true)
                        expect(totalCount).toBe(12)
                    })
            })
            test('GET 400 /api/articles?limit=cat - if limit is not num, bad req', () => {
                return request(app)
                    .get('/api/articles?limit=cat')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid input')
                    })
            })
            test('GET 400 /api/articles?p=cat - if p is not num, bad req', () => {
                return request(app)
                    .get('/api/articles?p=cat')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid input')
                    })
            })
        })

    });
    describe('POST /api/articles', () => {
        test('POST 200 /api/articles', () => {
            return request(app)
                .post('/api/articles')
                .send({
                    author: 'butter_bridge',
                    title: 'testarticle',
                    body: 'testbody',
                    topic: 'mitch',
                    article_img_url: 'https://avatars.githubusercontent.com/u/40837207?v=4'
                })
                .expect(200)
                .then(({ body: { newArticle } }) => {
                    const { title, topic, author, body, article_img_url, created_at, votes, article_id, comment_count } = newArticle
                    expect(title).toBe('testarticle')
                    expect(article_id).toBe(14)
                    expect(topic).toBe('mitch')
                    expect(author).toBe('butter_bridge')
                    expect(body).toBe('testbody')
                    expect(typeof created_at).toBe('string')
                    expect(votes).toBe(0)
                    expect(article_img_url).toBe('https://avatars.githubusercontent.com/u/40837207?v=4')
                    expect(comment_count).toBe(0)
                })
        })
        test('POST 200 /api/articles - avatar URL defaults if omitted', () => {
            return request(app)
                .post('/api/articles')
                .send({
                    author: 'butter_bridge',
                    title: 'testarticle',
                    body: 'testbody',
                    topic: 'mitch'
                })
                .expect(200)
                .then(({ body: { newArticle } }) => {
                    const { title, topic, author, body, article_img_url, created_at, votes, article_id, comment_count } = newArticle
                    expect(title).toBe('testarticle')
                    expect(article_id).toBe(14)
                    expect(topic).toBe('mitch')
                    expect(author).toBe('butter_bridge')
                    expect(body).toBe('testbody')
                    expect(typeof created_at).toBe('string')
                    expect(votes).toBe(0)
                    expect(article_img_url).toBe('default')
                    expect(comment_count).toBe(0)
                })
        })
        test('POST 200 /api/articles - ignores extra keys', () => {
            return request(app)
                .post('/api/articles')
                .send({
                    author: 'butter_bridge',
                    title: 'testarticle',
                    body: 'testbody',
                    topic: 'mitch',
                    article_img_url: 'https://avatars.githubusercontent.com/u/40837207?v=4',
                    malicious_key: 'egdfgd',
                    malicious_key2: 28
                })
                .expect(200)
                .then(({ body: { newArticle } }) => {
                    expect(newArticle.hasOwnProperty('maliciouskey')).toBe(false)
                    expect(newArticle.hasOwnProperty('maliciouskey2')).toBe(false)
                })
        })
        test('POST 400 /api/articles - malformed body', () => {
            return request(app)
                .post('/api/articles')
                .send({
                    author: 'butter_bridge',
                    body: 'testbody',
                    topic: 'mitch',
                    article_img_url: 'https://avatars.githubusercontent.com/u/40837207?v=4',
                    malicious_key: 'egdfgd',
                    malicious_key2: 28
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
    })
})
describe('/api/articles/:article_id', () => {
    describe('GET /api/articles/:article_id', () => {
        test('GET 200 /api/articles/1', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article_id).toBe(1)
                    expect(body.title).toBe("Living in the shadow of a great man")
                    expect(body.topic).toBe("mitch")
                    expect(body.author).toBe("butter_bridge")
                    expect(body.body).toBe("I find this existence challenging")
                    expect(body.created_at).toBe("2020-07-09T20:11:00.000Z")
                    expect(body.votes).toBe(100)
                    expect(body.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
                })
        });
        test('GET 200 /api/articles/1 - feature request, includes comment_count', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article_id).toBe(1)
                    expect(body.title).toBe("Living in the shadow of a great man")
                    expect(body.topic).toBe("mitch")
                    expect(body.author).toBe("butter_bridge")
                    expect(body.body).toBe("I find this existence challenging")
                    expect(body.created_at).toBe("2020-07-09T20:11:00.000Z")
                    expect(body.votes).toBe(100)
                    expect(body.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
                    expect(body.comment_count).toBe(11)
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
        test('PATCH 200 /api/articles/1 - happy path', () => {
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
        test('PATCH 200 /api/articles/1 - ignores aditional keys in req body', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({
                    inc_votes: -100,
                    what_is_the_point: 69,
                    malicious_key: 420
                })
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
        test('PATCH 400 /api/articles/cat - invalid id', () => {
            return request(app)
                .patch('/api/articles/cat')
                .send({ inc_votes: 1 })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        });
        test('PATCH 400 /api/articles/1 - bad req body, missing key', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({})
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        });
        test('PATCH 400 /api/articles/1 - bad req body, value not INT', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: 'cat' })
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
    describe('DELETE /api/articles/:article_id', () => {
        test('DELETE 204 /api/articles/1', () => {
            return request(app)
                .delete('/api/articles/1')
                .expect(204)
                .then(({ body }) => {
                    expect(body).toEqual({})
                })
        })
        test('DELETE 404 /api/articles/69 - article does not exist', () => {
            return request(app)
                .delete('/api/articles/69')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Not found')
                })
        })
        test('DELETE 400 /api/articles/cat - article_id is not valid', () => {
            return request(app)
                .delete('/api/articles/cat')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
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
                        expect(comment.article_id).toBe(1)
                        expect(typeof comment.votes).toBe('number')
                        expect(typeof comment.created_at).toBe('string')
                        expect(typeof comment.author).toBe('string')
                        expect(typeof comment.body).toBe('string')
                        expect(typeof comment.comment_id).toBe('number')
                    })
                    expect(comments).toBeSorted({ key: 'created_at', descending: true })
                })
        })
        test('GET 404 /api/articles/69/comments - id out of range', () => {
            return request(app)
                .get('/api/articles/69/comments')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Not found')
                })
        })
        test('GET 400 /api/articles/cat/comments - id invalid', () => {
            return request(app)
                .get('/api/articles/cat/comments')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
    })
    describe('GET /api/articles/:article_id/comments - FEATURE REQUEST - PAGINATION', () => {
        test('GET 200 /api/articles/1/comments?limit=10&p=1', () => {
            return request(app)
                .get('/api/articles/1/comments?limit=10&p=1')
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments.length <= 10).toBe(true)
                })
        })
        test('GET 200 /api/articles/1/comments?limit=5&p=3 - works with varied limit and page values', () => {
            return request(app)
                .get('/api/articles/1/comments?limit=5&p=3')
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments.length === 1).toBe(true)
                })
        })
        test('GET 200 /api/articles/1/comments?limit=5 - works with absent page value', () => {
            return request(app)
                .get('/api/articles/1/comments?limit=5')
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments.length === 5).toBe(true)
                })
        })
        test('GET 200 /api/articles/1/comments?p=2 - works with absent limit value (defaults to 10)', () => {
            return request(app)
                .get('/api/articles/1/comments?p=2')
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments.length === 1).toBe(true)
                })
        })
        test('GET 400 /api/articles/1/comments?limit=cat - errors if limit is bad value', () => {
            return request(app)
                .get('/api/articles/1/comments?limit=cat')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
        test('GET 400 /api/articles/1/comments?p=cat - errors if p is bad value', () => {
            return request(app)
                .get('/api/articles/1/comments?p=cat')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
        test('GET 400 /api/articles/1/comments?limt=5 - errors if query is bad', () => {
            return request(app)
                .get('/api/articles/1/comments?limt=5')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
    })
    describe('POST /api/articles/:article_id/comments', () => {
        test('POST 201 /api/articles/1/comments - happy path', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'I like this article',
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
        test('POST 400 /api/articles/cat/comments - invalid id', () => {
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
        test('POST 400 /api/articles/1/comments - broken req body', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({
                    username: 'butter_bridge',
                    baddy: 'I like this article'
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
        test('POST 404 /api/articles/69/comments - id out of range', () => {
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
        test('POST 404 /api/articles/1/comments - author not in db (fkey violation)', () => {
            return request(app)
                .post('/api/articles/1/comments')
                .send({
                    username: 'koo',
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
describe('checkCommentExists', () => {
    test('should return a 404 if comment_id is not present in table', () => {
        checkCommentExists(69)
            .catch((err) => {
                expect(typeof err).toBe('object')
                expect(err.msg).toBe('Not found')
                expect(err.status).toBe(404)
            })
    })
    test('should return undefined if comment_id is present in table', () => {
        checkCommentExists(1)
            .then((result) => {
                expect(result).toBe(undefined)
            })
    });
    test('should return a 400 if comment_id is not valid', () => {
        checkCommentExists('cat')
            .catch((err) => {
                expect(typeof err).toBe('object')
                expect(err.msg).toBe('Invalid input')
                expect(err.status).toBe(400)
            })
    });
});
describe('/api/comments/:comment_id', () => {
    describe('DELETE /api/comments/:comment_id', () => {
        test('DELETE 204 /api/comments/1', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204)
        });
        test('DELETE 404 /api/comments/69', () => {
            return request(app)
                .delete('/api/comments/69')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Not found')
                })
        });
        test('DELETE 400 /api/comments/cat', () => {
            return request(app)
                .delete('/api/comments/cat')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        });
    });
    describe('PATCH /api/comments/:comment_id', () => {
        test('PATCH 200 /api/comments/1', () => {
            return request(app)
                .patch('/api/comments/1')
                .send({ inc_votes: 1 })
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment.votes).toBe(17)
                    expect(comment.comment_id).toBe(1)
                    expect(comment.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!")
                    expect(comment.author).toBe("butter_bridge")
                    expect(comment.article_id).toBe(9)
                    expect(comment.created_at).toBe("2020-04-06T12:17:00.000Z")
                })
        })
        test('PATCH 200 /api/comments/1 - negative inc_votes', () => {
            return request(app)
                .patch('/api/comments/1')
                .send({ inc_votes: -1 })
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment.votes).toBe(15)
                    expect(comment.comment_id).toBe(1)
                    expect(comment.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!")
                    expect(comment.author).toBe("butter_bridge")
                    expect(comment.article_id).toBe(9)
                    expect(comment.created_at).toBe("2020-04-06T12:17:00.000Z")
                })
        })
        test('PATCH 200 /api/comments/1 - ignores extra keys', () => {
            return request(app)
                .patch('/api/comments/1')
                .send({ inc_votes: -1, malicious_key: 69 })
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment.votes).toBe(15)
                    expect(comment.comment_id).toBe(1)
                    expect(comment.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!")
                    expect(comment.author).toBe("butter_bridge")
                    expect(comment.article_id).toBe(9)
                    expect(comment.created_at).toBe("2020-04-06T12:17:00.000Z")
                    expect(comment.malicious_key).toBe(undefined)
                })
        })
        test('PATCH 404 /api/comments/69 - comment_id does not exist', () => {
            return request(app)
                .patch('/api/comments/69')
                .send({ inc_votes: 1 })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Not found')
                })
        })
        test('PATCH 400 /api/comments/cat - comment_id invalid', () => {
            return request(app)
                .patch('/api/comments/cat')
                .send({ inc_votes: 1 })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid input')
                })
        })
        test('PUT 405 /api/comments/1 - bad method', () => {
            return request(app)
                .put('/api/comments/1')
                .send({ inc_votes: 1 })
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Bad method')
                })
        })
    });
})
describe('/api/users', () => {
    describe('GET /api/users', () => {
        test('GET 200 /api/users', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body: { users } }) => {
                    expect(users.length).toBe(4)
                    users.forEach((user) => {
                        expect(typeof user.username).toBe('string')
                        expect(typeof user.name).toBe('string')
                        expect(typeof user.avatar_url).toBe('string')
                    })
                })
        });
        test('PATCH 405 /api/users', () => {
            return request(app)
                .patch('/api/users')
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Bad method')
                })
        })
    });
    describe('GET /api/users/:username', () => {
        test('GET 200 /api/users/butter_bridge', () => {
            return request(app)
                .get('/api/users/butter_bridge')
                .expect(200)
                .then(({ body: { user } }) => {
                    expect(user.username).toBe('butter_bridge')
                    expect(user.name).toBe('jonny')
                    expect(user.avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')
                })
        })
        test('GET 404 /api/users/notauser', () => {
            return request(app)
                .get('/api/users/notauser')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Not found')
                })
        })
        test('PATCH 405 /api/users/butter_bridge', () => {
            return request(app)
                .patch('/api/users/butter_bridge')
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Bad method')
                })
        })
        test('DELETE 405 /api/users/butter_bridge', () => {
            return request(app)
                .delete('/api/users/butter_bridge')
                .expect(405)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Bad method')
                })
        })
    })
});

