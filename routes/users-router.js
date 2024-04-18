const { getUsers, getUserByUsername } = require('../controllers/users.controller');
const { methodNotAllowed } = require('../errors');

const usersRouter = require('express').Router();

usersRouter
  .route('/')
  .get(getUsers)
  .all(methodNotAllowed)

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(methodNotAllowed)
module.exports = usersRouter;