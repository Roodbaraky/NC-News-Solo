

exports.handleCustomErrors = (err, req, res, next) => {
    // console.log(err.status)
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    //Is it a problem if I leave these here? Quicker to comment/uncomment for debugging as I progress...
    // console.log(err.code)
    // console.log(err)
    const fourHundreds = ['22P02', '23502', '42703']
    const fourOhFours = ['23503']
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