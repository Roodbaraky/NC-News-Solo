const db = require('../db/connection')
exports.fetchArticles = () => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`)
        .then(({ rows }) => {

            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            return rows
        })
}

exports.fetchArticlesById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {

            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            return rows
        })
}

exports.checkArticleExists = (article_id) => {
    if (isNaN(+article_id)) {
        return Promise.reject({ status: 400, msg: "Invalid input" })
    }
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
        })
}


exports.fetchArticleCommentsById = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
        .then(({ rows }) => {
            return rows
        })
}

exports.postArticleCommentsById = (article_id, comment) => {
    const { username, body } = comment
    article_id = +article_id

    return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [article_id, username, body])
        .then(({ rows }) => {
            return rows
        })
}

exports.updateArticleById = (article_id, update) => {
    const { inc_votes } = update
    return db.query(`UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`, [article_id, inc_votes])
        .then(( {rows} ) => {
            return rows
        })
}