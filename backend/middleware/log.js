// Third-party modules
const { format } = require('date-fns')

// Built-in modules
const fs = require('fs')
const path = require('path')
const fsPromises = require('fs').promises

// Log event types
const logTypes = new Set(['req', 'log', 'err'])

exports.logEvents = async (type, message) => {
    // Argument validation
    if (!type in logTypes) {
        throw `Log event type of ${type} is not valid`
    }

    // Assemble messages
    const dateTime = `${format(new Date(), 'yyyy.MM.dd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${message}`

    // Proper console output
    if (type === 'err') {
        console.error(logItem)
    } else {
        console.log(logItem)
    }

    // Output to file
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', `${type}.txt`), `${logItem}\n`)
    } catch (err) {
        console.error(err)
    }
}

exports.reqLogger = (req, res, next) => {
    this.logEvents('req', `${req.method}\t${req.headers.origin}\t${req.url}`)
    next()
}
