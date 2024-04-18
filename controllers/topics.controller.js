const index = require('../db/data/test-data/index')
const { fetchTopics, postTopics } = require('../models/topics.model')

exports.getTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch((next));
}

exports.addTopics = (req, res, next) => {
    const topicContent = req.body
    postTopics(topicContent)
        .then((topic) => {
            res.status(201).send({ topic })
        })
        .catch((next))
}