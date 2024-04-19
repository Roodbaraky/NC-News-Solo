const { addArticle, removeArticleById, getArticles, getArticlesById, editArticleById, addArticleCommentsById, getArticleCommentsById } = require('../controllers/articles.controller');
const { methodNotAllowed } = require('../errors');

const articlesRouter = require('express').Router();

articlesRouter
  .route('/')
  .get(getArticles)
  .post(addArticle)
  .all(methodNotAllowed)

articlesRouter
  .route('/:article_id')
  .get(getArticlesById)
  .patch(editArticleById)
  .delete(removeArticleById)
  .all(methodNotAllowed)

articlesRouter
  .route('/:article_id/comments')
  .get(getArticleCommentsById)
  .post(addArticleCommentsById)
  .all(methodNotAllowed)

module.exports = articlesRouter;