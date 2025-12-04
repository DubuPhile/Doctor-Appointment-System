const allowedOrigin = require('./allowedOrigin');

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if(allowedOrigin.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error('Not Allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;