const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/endpoints.controller')
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router')
const usersRouter = require('./users-router')
const commentsRouter = require('./comments-router')
const { handleCustomErrors } = require('../errors/index')
const { getTopics } = require('../controllers/topics.controller');
const { getArticles } = require('../controllers/articles.controller');
const { getUsers } = require('../controllers/users.controller');



apiRouter
    .route('/')
    .get(getEndpoints)
    .all((req, res) => {
        res.status(405).send({ msg: 'Bad method' } )
    })

apiRouter
.route('/topics')
.get(getTopics)
.all((req, res) => {
    res.status(405).send({ msg: 'Bad method' } )
})

apiRouter
.route('/articles')
.get(getArticles)
.all((req, res) => {
    res.status(405).send({ msg: 'Bad method' } )
})

apiRouter
.route('/users')
.get(getUsers)
.all((req, res) => {
    res.status(405).send({ msg: 'Bad method' } )
})





module.exports = apiRouter;