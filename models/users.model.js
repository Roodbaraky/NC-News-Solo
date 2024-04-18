const { use } = require('../app')
const db = require('../db/connection')

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`)
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }
            return rows
        })
}

exports.fetchUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" })
        }
        return rows[0]
    })
}