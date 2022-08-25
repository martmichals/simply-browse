// Third-party dependencies
const https = require('https')
const Bottleneck = require('bottleneck/es5')

// Local imports
const log = require('../middleware/log')
const { keys, limiterSettings } = require('../config/secrets')

// Instantaneous limiter 
const limiter = new Bottleneck(limiterSettings)

// Search function
exports.searchBing = async function (queryString, res) {
    // Create a URL encoded complete query object
    const query = new URLSearchParams({
        count:           50,
        q:               queryString,
        responseFilter: 'webpages',
        setLang:        'en-US',
        textFormat:     'HTML'
    }).toString()

    // Log query
    log.logEvents('log', `Launching Bing API request with the query "${queryString}"`)

    // Launch the request
    limiter.submit(
        https.get, 
        {
            hostname: 'api.bing.microsoft.com',
            path:     '/v7.0/search?q=' + query,
            headers:  { 'Ocp-Apim-Subscription-Key': keys.bing }
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
                throw err
            })
        } 
    )
}
