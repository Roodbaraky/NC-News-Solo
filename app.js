const express = require("express");
const app = express();
const apiRouter = require('./routes/api-router');

const { handleCustomErrors, handlePsqlErrors, handleServerErrors, catchAll } = require('./errors/index')

app.use(express.json())

app.use('/api', apiRouter)

 
app.all('*', catchAll)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)



module.exports = app;