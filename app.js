const express = require("express");
const app = express();
const {getArticlesById, getArticles} = require('./controllers/articles.controller')
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getTopics } = require('./controllers/topics.controller')
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, catchAll } = require('./errors/index')


app.get('/api', getEndpoints)
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticlesById)
app.get('/api/articles', getArticles)

app.all('*',catchAll)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)
















module.exports = app;