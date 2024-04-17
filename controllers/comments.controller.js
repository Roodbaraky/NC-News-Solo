
const { deleteCommentById, checkCommentExists } = require('../models/comments.model')

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params
   return deleteCommentById(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch(next)
}