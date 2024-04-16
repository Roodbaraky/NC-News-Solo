
const { deleteCommentById, checkCommentExists } = require('../models/comments.model')

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params
    Promise.all([deleteCommentById(comment_id), checkCommentExists(comment_id)])
        .then(() => {
            res.status(204).send()
        })
        .catch(next)
}