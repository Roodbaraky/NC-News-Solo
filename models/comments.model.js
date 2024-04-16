const db = require('../db/connection')

exports.deleteCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
        .then(() => {
            return
        })
}

exports.checkCommentExists = (comment_id) => {
    if (isNaN(+comment_id)) {
        return Promise.reject({ status: 400, msg: "Invalid input" })
    }
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
        })
}