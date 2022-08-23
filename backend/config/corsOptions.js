const corsWhitelist = new Set([
    'http://127.0.0.1:5500'
])
const corsOptions = {
    origin: (origin, callback) => {
        if (origin in corsWhitelist || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Origin not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions