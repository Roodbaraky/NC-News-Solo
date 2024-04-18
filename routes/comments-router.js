const { removeCommentById } = require('../controllers/comments.controller');
const { methodNotAllowed } = require('../errors');

const apiRouter = require('express').Router();

apiRouter
  .route('/:comment_id')
  .delete(removeCommentById)
  .all(methodNotAllowed)

module.exports = apiRouter;