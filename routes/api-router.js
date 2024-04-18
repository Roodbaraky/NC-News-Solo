const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/endpoints.controller')
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router')
const usersRouter = require('./users-router')
const commentsRouter = require('./comments-router')
const { methodNotAllowed } = require('../errors/index')
const { getTopics } = require('../controllers/topics.controller');



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
    .use('/users', usersRouter)
    

apiRouter
    .use('/comments', commentsRouter)





module.exports = apiRouter;