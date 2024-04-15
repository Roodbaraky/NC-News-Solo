const index = require('../db/data/test-data/index')
const {fetchTopics} = require('../models/topics.model')

exports.getTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch((err) => {
            res.status(err.status).send({ error: err.message });

        });
}