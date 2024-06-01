const express = require("express");
const app = express();
const apiRouter = require('./routes/api-router');



const { handleCustomErrors, handlePsqlErrors, handleServerErrors, catchAll } = require('./errors/index')

app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const allowedOrigins = ['http://localhost:5174', 'https://nc-news-solo.onrender.com', 'https://nc-news-solo.onrender.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
  });
app.use(express.json())

app.use('/api', apiRouter)


app.all('*', catchAll)
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)



module.exports = app;
