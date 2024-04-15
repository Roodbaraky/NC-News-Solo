const { end } = require('../db/connection');
const index = require('../db/data/test-data/index')
const { fetchEndpoints } = require('../models/endpoints.model')

exports.getEndpoints = (req, res, next) => {
    const endpoints = fetchEndpoints()
    res.status(200).send(endpoints);

}