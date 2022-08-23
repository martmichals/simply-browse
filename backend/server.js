// NPM modules
const cors = require('cors')
const express = require('express')

// Local modules
const log = require('./middleware/log')
const { corsOptions } = require('./config/corsOptions')
const { errorHandler } = require('./middleware/errorHandler')

// Express app
const app = express()

// Request logging
app.use(log.reqLogger)

// Third-party middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// API instantiation
app.use('/api', require('./routes/api'))

// Error handling and logging
app.use(errorHandler)

// Instantiate server 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => log.logEvents('log', `Server running on port ${PORT}`))

