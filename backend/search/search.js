// Dependencies
const https = require('https')
const Bottleneck = require('bottleneck/es5')

// API Details and limiter
const BING_KEY = require('../secrets.json').BING_KEY
const BING_LIMITER = new Bottleneck({
    maxConcurrent: 3,
    minTime: 333
})

parseQuery = function(req) {
    // Check if query is defined
    if (req.query.type === undefined) {
        console.error('Bad request to parseQuery')
        throw 'Request query is missing required parameters!'
    }

    // Parse query based on type
    switch (req.query.type) {
        case '2term':
            // Handle 2 term query request
            if (typeof req.query.term1 == 'string' || typeof req.query.term2 == 'string') {
                return '"' + req.query.term1 + '" "' + req.query.term2 + '"'
            } else {
                console.error('Bad 2term argument specification')
                throw 'Query\'s term1 and/or term2 are not properly specified!'
            }
        default:
            console.error('Bad query type specification')
            throw 'The query type specified, ' + req.query.type + ' has no associated handler!'
    } 
}

module.exports.searchBing = async function (req, res, db) {
    // Parse the query
    const queryString = parseQuery(req)

    // TODO: Check the server cache for the response

    // Create the query
    const query = new URLSearchParams({
        mkt:            'en-US',
        count:           50,
        q:               queryString,
        responseFilter: 'webpages',
        setLang:        'en-US',
        textFormat:     'HTML'
    }).toString()
    console.log('Querying the Bing Search API with parameters: ' + query)

    // Launch request to Bing API
    BING_LIMITER.submit(
        https.get, 
        {
            hostname: 'api.bing.microsoft.com',
            path:     '/v7.0/search?q=' + query,
            headers:  { 'Ocp-Apim-Subscription-Key': BING_KEY }
        },
        resBing => {
            let body = ''
            resBing.on('data', part => body += part)
            resBing.on('end', () => {
                // Filter out unnecessary components of the response
                const searchResults = JSON.parse(body)

                // Construct the server response from the search results
                let serverResponse = { 
                    pages: [],
                    pageCount: 0
                }
                for (const page of searchResults.webPages.value) {
                    serverResponse.pages.push({
                        name:       page.name,
                        url:        page.url,
                        displayUrl: page.displayUrl,
                        snippet:    page.snippet
                    })
                    serverResponse.pageCount++
                }

                // TODO: Populate the server cache with the response

                // Send the server response
                res.status(201).send(serverResponse)
            })
            resBing.on('error', err => {
                console.error('Error: ' + err.message)
                throw err
            })
        }
    )
}