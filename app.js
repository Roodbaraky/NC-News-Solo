const express = require("express");
const app = express();
const apiRouter = require('./routes/api-router');
const { getArticlesById, getArticles, getArticleCommentsById, addArticleCommentsById, editArticleById } = require('./controllers/articles.controller')
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getTopics } = require('./controllers/topics.controller')
const { removeCommentById } = require('./controllers/comments.controller')
const { getUsers } = require('./controllers/users.controller')
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, catchAll } = require('./errors/index')

app.use(express.json())

app.use('/api', apiRouter)

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticlesById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getArticleCommentsById)
app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', addArticleCommentsById)

app.patch('/api/articles/:article_id', editArticleById)

app.delete('/api/comments/:comment_id', removeCommentById)

app.all('*', catchAll)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)
















module.exports = app;