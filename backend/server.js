// Syntax to export a function from a module
// exports.fxnName = (a, b) => {}

// Import that module into a different file
// const server = require('./server')
// Regex accepted in the express routing fxns

// NPM modules
const cors = require('cors')
const express = require('express')

// Local modules
const log = require('./middleware/log')

// Express app
const app = express()

// Middleware request logger
app.use(log.logger)

// Third-party middleware
const corsWhitelist = new Set(['http://127.0.0.1:5500'])
app.use(cors({
    origin: (origin, callback) => {
        if (origin in corsWhitelist || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Origin not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Instantiate server 
const PORT = process.env.PORT || 3000

