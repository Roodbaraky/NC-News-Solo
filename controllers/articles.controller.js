const express = require("express");
const app = express();
const index = require('../db/data/test-data/index')
const { fetchArticles } = require('../models/articles.model')

app.use(express.json());

exports.getArticlesById = (req, res, next) => {
    const article_id = req.params.article_id;
    fetchArticles(article_id)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
}