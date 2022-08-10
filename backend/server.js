// Dependencies
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

// Set up app
app = express()
port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Set up endpoints
app.get('/search', (req, res) => {
    console.log('Hit the search endpoint')
    // TODO: Set up queue for incoming search requrests to enforce TPS limit on Bing API
    // TODO: Set up persistent DB solution to store requests in the month, TPS load for the second
    // TODO: Set up Bing API querying (conditional on abscence from local cache)
    // TODO: Set up local persistent DB solution to store request results
    // TODO: Return results/errors properly
})
app.get('/view', (req, res) => {
    console.log('Hit the view endpoint')
    // TODO: Set up code to get webpage
    // TODO: Parse webpage with readability
    // TODO: Parse links/images etc. still embedded in readability
    // TODO: Do any additional HTML tag processing deemed necessary
    // TODO: Cache view results in local persistent DB solution
})

// Start app
app.listen(port, () => { console.log('API live on port ' + port) })
