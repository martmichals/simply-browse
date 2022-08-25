// Local modules
const log = require('../middleware/log')

// Third-party modules
const express = require('express')
const router = express.Router()

// Search with the bing API
router.get('/search', (req, res) => {
    // Ensure the query type is defined
    if (req.query.type == undefined) {
        throw new Error('Search request is missing required "type" parameter')
    }

    // Parse the query based on type
    let queryString
    switch (req.query.type) {
        case '2term':
            // Validate arguments
            if (typeof req.query.term1 == 'string' && typeof req.query.term2 == 'string') {
               queryString = `"${req.query.term1}" "${req.query.term2}"` 
               break
            }
            throw new Error('Query\'s term1 and/or term2 are not properly specified!')
        default:
            throw new Error(`The query type specified, ${req.query.type} has no associated handler!`)
    }

    // Log out the parse
    log.logEvents('log', `Parsed GET request query into queryString "${queryString}"`)
})

module.exports = router