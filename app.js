const express = require("express");
const app = express();
const { getEndpoints } = require('./controllers/endpoints.controller')
const { getTopics } = require('./controllers/topics.controller')
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, catchAll } = require('./errors/index')

app.use(express.json());
app.get('/api', getEndpoints)
app.get('/api/topics', getTopics);

app.use(catchAll)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)
















module.exports = app;