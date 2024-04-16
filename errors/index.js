

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    //Is it a problem if I leave these here? Quicker to comment/uncomment for debugging as I progress...
    // console.log(err.code)
    // console.log(err)
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid input' });
    }
    if (err.code === '23503') {
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