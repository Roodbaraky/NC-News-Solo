const express = require("express");
const app = express();
const index = require('../db/data/test-data/index')
const { fetchArticles, fetchArticlesById, fetchArticleCommentsById } = require('../models/articles.model')

exports.getArticlesById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticlesById(article_id)
        .then(([article]) => {
            res.status(200).send({ article });
        })
        .catch(next);
}

exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
}

exports.getArticleCommentsById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleCommentsById(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch(next)

}