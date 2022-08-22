// NPM modules
const cors = require('cors')
const express = require('express')

// Local modules
const log = require('./middleware/log')
const { errorHandler } = require('./middleware/errorHandler')

// Express app
const app = express()

// Request logging
app.use(log.reqLogger)

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

// Error handling and logging
app.use(errorHandler)

// Instantiate server 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => log.logEvents('log', `Server running on port ${PORT}`))

