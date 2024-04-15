const db = require('../db/connection')
exports.fetchArticles = () => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`)
        .then(({ rows }) => {

            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            return rows
        })
        .catch((err) => {
            console.log(err)
            return Promise.reject(err)
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

exports.fetchArticleCommentsById = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            return rows
        })
}