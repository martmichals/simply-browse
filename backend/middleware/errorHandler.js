const log = require('./log')

exports.errorHandler = (err, req, res, next) => {
    log.logEvents('err', `${err.name}: ${err.message}`)
    console.error(err.stack)
    res.status(500).send(err.message)
}
