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