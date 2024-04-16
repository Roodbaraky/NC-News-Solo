const express = require("express");
const app = express();
const index = require('../db/data/test-data/index')
const { fetchArticles, fetchArticlesById, fetchArticleCommentsById, postArticleCommentsById, checkArticleExists, updateArticleById } = require('../models/articles.model')


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
    Promise.all([fetchArticleCommentsById(article_id), checkArticleExists(article_id)])
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