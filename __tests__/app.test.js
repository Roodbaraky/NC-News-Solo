const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const index = require('../db/data/test-data/index')
const endpointsData = require('../endpoints.json')
const { checkArticleExists } = require('../models/articles.model')
const { checkCommentExists } = require('../models/comments.model')


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
    describe('GET 200 /api/articles', () => {
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

            test('GET 200 /api/articles?sort_by=comment_count - testing aggregate column', () => {
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

            test('GET 200 /api/articles?order=asc - happy path', () => {
                return request(app)
                    .get('/api/articles?order=asc')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({ descending: false })
                    })
            });

            test('GET 200 /api/articles?order=desc - do nothing, default behaviour', () => {
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

    });
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
        });

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


});

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



    });
});