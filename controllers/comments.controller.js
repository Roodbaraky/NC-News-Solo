
const { deleteCommentById, updateCommentById, checkCommentExists, fetchCommentsByAuthor } = require('../models/comments.model')

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params
    return deleteCommentById(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch(next)
}

exports.editCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const update = req.body
    Promise.all([updateCommentById(comment_id, update), checkCommentExists(comment_id)])
        .then(([[comment]]) => {
            res.status(200).send({ comment })
        })
        .catch(next)

}

exports.getCommentsByAuthor = (req,res,next) =>{
    const {author} = req.params
    fetchCommentsByAuthor(author)
        .then((comments) => {
            res.status(200).send({comments});
        })
        .catch(next);
}