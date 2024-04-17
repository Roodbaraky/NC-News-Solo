const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/endpoints.controller')
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router')
const usersRouter = require('./users-router')
const commentsRouter = require('./comments-router')
const { handleCustomErrors } = require('../errors/index')



apiRouter
    .route('/')
    .get(getEndpoints)
    .all((req, res) => {
        res.status(405).send({ msg: 'Bad method' } )
    })
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentsRouter)


module.exports = apiRouter;