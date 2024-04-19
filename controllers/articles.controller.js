const express = require("express");
const app = express();
const index = require('../db/data/test-data/index')
const { deleteArticleById, fetchArticles, fetchArticlesById, fetchArticleCommentsById, postArticleCommentsById, checkArticleExists, updateArticleById, postArticle } = require('../models/articles.model')
app.use(express.json)

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticlesById(article_id)
        .then((article) => {
            res.status(200).send(article);
        })
        .catch(next);
}

exports.getArticles = (req, res, next) => {
    const query = req.query
    fetchArticles(query)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
}

exports.getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params
    const query = req.query
    Promise.all([fetchArticleCommentsById(article_id, query), checkArticleExists(article_id)])
        .then(([comments]) => {
            res.status(200).send({ comments });
        })
        .catch(next)
}
exports.addArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params
    const comment = req.body
    postArticleCommentsById(article_id, comment)
        .then(([comment]) => {
            res.status(201).send({ comment })
        })
        .catch(next)
}

exports.editArticleById = (req, res, next) => {
    const { article_id } = req.params
    const update = req.body
    Promise.all([updateArticleById(article_id, update), checkArticleExists(article_id)])
        .then(([[article]]) => {
            res.status(200).send({ article })
        })
        .catch(next)
}

exports.addArticle = (req, res, next) => {
    const article = req.body
    postArticle(article)
        .then((newArticle) => {
            res.status(200).send({ newArticle })
        })
        .catch(next)
}

exports.removeArticleById = (req, res, next) => {
    const { article_id } = req.params
    return deleteArticleById(article_id)
        .then((noContent) => {
            res.status(204).send(noContent)
        })
        .catch(next)
}