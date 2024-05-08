const { removeCommentById, editCommentById, getCommentsByAuthor } = require('../controllers/comments.controller');
const { methodNotAllowed } = require('../errors');

const apiRouter = require('express').Router();
apiRouter
.route('/by/:author')
.get(getCommentsByAuthor)
.all(methodNotAllowed)
apiRouter
  .route('/:comment_id')
  .delete(removeCommentById)
  .patch(editCommentById)
  .all(methodNotAllowed)

module.exports = apiRouter;