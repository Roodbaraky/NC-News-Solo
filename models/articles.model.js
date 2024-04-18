const db = require('../db/connection')
exports.fetchArticles = (query) => {
    const queries = [
        "author",
        "topic",
        "sort_by",
        "order",
        "limit",
        "p"
    ]
    const columns = [
        'article_id',
        'title',
        'topic',
        'author',
        'created_at',
        'votes',
        'article_img_url',
        'comment_count'
    ]
    let queryString = ``
    const SQLString = `
    SELECT
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    article_img_url,
    COUNT(comments.article_id)::INTEGER AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id=articles.article_id`
    const SQLString2 = `
        SELECT
        COUNT(comments.article_id)::INTEGER AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id=articles.article_id`


    const groupByString = ` GROUP BY articles.article_id`
    let orderByString = ` ORDER BY articles.created_at DESC`
    let limitString = ``
    const orderValues = ['asc', 'ASC', 'desc', 'DESC']
    const queryKeys = Object.keys(query)

    if (queryKeys.length !== 0) {

        const { author, topic, sort_by, order, limit, p } = query
        let useLimit = limit || 10
        if (!queryKeys.every((key) => queries.includes(key))) {
            return Promise.reject({ status: 400, msg: "Invalid input" })
        }

        if (sort_by) {
            if (!columns.includes(sort_by)) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            orderByString = ` ORDER BY articles.${sort_by} DESC`
            if (sort_by === 'comment_count') {
                orderByString = ` ORDER BY ${sort_by} DESC`
            }
        }

        if (order) {
            if (!orderValues.includes(order)) {
                return Promise.reject({ status: 400, msg: "Invalid input" })
            }
            if (order === 'ASC' || order === 'asc') {
                orderByString = ` ORDER BY articles.created_at ASC`

            }

        }
        if (topic) {
            queryString = ` WHERE topic = '${topic}'`
        }
        if (limit) {
            if (isNaN(+limit)) return Promise.reject({ status: 400, msg: "Invalid input" })
            const pages = +limit * (+p - 1)
            limitString = ` LIMIT ${useLimit || 'ALL'} OFFSET ${pages || 0}`
        }
        else if (p) {
            if (isNaN(+p)) return Promise.reject({ status: 400, msg: "Invalid input" })

            const pages = 10 * (+p - 1)
            limitString = ` LIMIT ${useLimit || 'ALL'} OFFSET ${pages || 0}`
        }

    }

    const mainDbQuery = db.query(`${SQLString}${queryString}${groupByString}${orderByString}${limitString}`)
    const totalCountQuery = db.query(`${SQLString2}${queryString}${groupByString}${orderByString}`)
    return Promise.all([mainDbQuery, totalCountQuery])
        .then(([{ rows }, totalCountReturn]) => {
            const totalCount = totalCountReturn.rows.length
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            return totalCount === rows.length
                ? rows
                : { rows, totalCount }
        })
}

exports.fetchArticlesById = (article_id) => {
    const SQLString = `
    SELECT
    articles.article_id,
    articles.body,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    article_img_url,
    COUNT(comments.article_id)::INTEGER AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id=articles.article_id`

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
    return db.query(`
    SELECT *
    FROM articles
    WHERE article_id = $1
    `, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
        })
}


exports.fetchArticleCommentsById = (article_id, query) => {
    const queries = [
        "author",
        "topic",
        "sort_by",
        "order",
        "limit",
        "p"
    ]
    const queryKeys = Object.keys(query)
    const { p, limit } = query
    let useLimit = limit || 10
    if (queryKeys.length !== 0) {

        if (!queryKeys.every((key) => queries.includes(key))) {
            return Promise.reject({ status: 400, msg: "Invalid input" })
        }
    }
    const SQLString = `
            SELECT *
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC
            `
    let limitString = ``
    if (limit) {
        if (isNaN(+limit)) { return Promise.reject({ status: 400, msg: "Invalid input" }) }
        const pages = +limit * (+p - 1)
        limitString = ` LIMIT ${useLimit || 'ALL'} OFFSET ${pages || 0}`
    }
    else if (p) {
        if (isNaN(+p)) { return Promise.reject({ status: 400, msg: "Invalid input" }) }

        const pages = 10 * (+p - 1)
        limitString = ` LIMIT ${useLimit || 'ALL'} OFFSET ${pages || 0}`
    }
    return db.query(`${SQLString}${limitString}`, [article_id])
        .then(({ rows }) => {
            return rows
        })
}

exports.postArticleCommentsById = (article_id, comment) => {
    const { username, body } = comment
    article_id = +article_id

    return db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;`, [article_id, username, body])
        .then(({ rows }) => {
            return rows
        })
}

exports.updateArticleById = (article_id, update) => {
    const { inc_votes } = update
    return db.query(`
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;
    `, [article_id, inc_votes])
        .then(({ rows }) => {
            return rows
        })
}

exports.postArticle = (article) => {
    const { title, topic, author, body, article_img_url } = article
    const valueArr = [title, topic, author, body, article_img_url]
    return db.query(`
    INSERT INTO articles
    (title, topic, author, body, article_img_url)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *,
    (
        SELECT COUNT(*)
        FROM comments
        WHERE comments.article_id = articles.article_id
    )
    ::INTEGER AS comment_count;
    `, valueArr)
        .then(({ rows }) => {
            return rows[0]
        })
}