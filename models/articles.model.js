const db = require('../db/connection')
exports.fetchArticles = (query) => {
    const positionalParams = []
    const queries = [
        "author",
        "topic",
        "sort_by",
        "order"
    ]
    const columns = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count']
    let queryString = ``
    const SQLString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id`
    const groupByString = ` GROUP BY articles.article_id`
    let orderByString = ` ORDER BY articles.created_at DESC`


    if (Object.keys(query).length !== 0) {
        const [[key, value]] = Object.entries(query)

        if (!queries.includes(key)) {
            return Promise.reject({ status: 400, msg: "Invalid input" })
        }


        queryString = ` WHERE ${key} = '${value}'`


        if (key === 'sort_by') {
            if (!columns.includes(value)) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            orderByString = ` ORDER BY articles.${value} DESC`
            queryString = ``

        }
    }

    return db.query(SQLString + queryString + groupByString + orderByString, positionalParams)
        .then(({ rows }) => {

            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            return rows
        })
}

exports.fetchArticlesById = (article_id) => {
    const SQLString = `SELECT articles.article_id, articles.body, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id=articles.article_id`

    const whereString = ` WHERE articles.article_id = $1`

    const groupByString = ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    return db.query(SQLString + whereString + groupByString, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }

            return rows[0]
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
        .then(({ rows }) => {
            return rows
        })
}

// exports.checkColumnExists = (column) => {
//     return db.query(`SELECT * 
//         FROM INFORMATION_SCHEMA.COLUMNS 
//         WHERE TABLE_NAME = N'articles'`)
//         .then(({ rows }) => {
//             const existing = rows.map((row) => row.column_name)
//             return existing.includes(column)
//         })
// }

// return exports.checkColumnExists(value)
//     .then((result) => {
//         if (result) {
//             orderByString = ` ORDER BY articles.${value} DESC`
//             queryString = ``
//             return db.query(SQLString + queryString + groupByString + orderByString, positionalParams)
//                 .then(({ rows }) => {

//                     if (!rows.length) {
//                         return Promise.reject({ status: 404, msg: "Not found" })
//                     }
//                     return rows
//                 })
//         } else {
//             return Promise.reject({ status: 404, msg: "Not found" })
//         }
//     })