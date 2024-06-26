

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    // console.log(err)
    // console.log(err.code)

    const fourHundreds = ['22P02', '23502']
    const fourOhFours = ['23503','42703']
    if (fourHundreds.includes(err.code)) {
        res.status(400).send({ msg: 'Invalid input' });
    }
    if (fourOhFours.includes(err.code)) {
        res.status(404).send({ msg: 'Not found' });
    }
    else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
};

exports.catchAll = (req, res, next) => {
    const err = new Error()
    err.status = 404
    err.msg = 'Not found'
    next(err)
}

exports.methodNotAllowed = (req, res, next) => {
    res.status(405).send({ msg: 'Bad method' })
}
exports.err404 = () => {
    return Promise.reject({ status: 404, msg: "Not found" })}
exports.err400 = () => {
    return Promise.reject({ status: 400, msg: "Invalid input" })
}