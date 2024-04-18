const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/endpoints.controller')
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router')
const usersRouter = require('./users-router')
const commentsRouter = require('./comments-router')
const { methodNotAllowed } = require('../errors/index')
const { getTopics } = require('../controllers/topics.controller');
const { getUsers } = require('../controllers/users.controller');



apiRouter
    .route('/')
    .get(getEndpoints)
    .all(methodNotAllowed)

apiRouter
    .route('/topics')
    .get(getTopics)
    .all(methodNotAllowed)



apiRouter
    .use('/articles', articlesRouter)



apiRouter
    .route('/users')
    .get(getUsers)
    .all(methodNotAllowed)

apiRouter
    .use('/comments', commentsRouter)





module.exports = apiRouter;