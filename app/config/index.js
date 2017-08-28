if(process.env.NODE_ENV === 'production') {

    let redisURI = require('url').parse(process.env.REDIS_URL);
    let redisPassword = redisURI.auth.split(":")[1];

    module.exports = {
        host: process.env.host || "",
        dbURI: process.env.dbURI,
        sessionSecret: process.env.sessionSecret,
        fb: {
            clientID: process.env.fbClientID,
            clientSecret: process.env.fbClientSecret,
            callbackURL: process.env.host + "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        google: {
            clientID: process.env.gClientID,
            clientSecret: process.env.gClientSecret,
            callbackURL: process.env.host + "/auth/google/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        twitter: {
            consumerKey: process.env.twConsumerKey,
            consumerSecret: process.env.twConsumerSecret,
            callbackURL: process.env.host + "/auth/twitter/callback",
            profileFields: ['id', 'displayName', 'photos']
        },
        redis : {
            host: redisURI.hostname,
            port: redisURI.port,
            password: redisPassword
        }
    }
} else {
    module.exports = require('./development.json');
}

/*

// development.json has to be created, as follows:
// also process.ENV's on prod. server must be set

{
  "host": "http://localhost:3000 ",
  "dbURI": "mongodb:// ... ",
"sessionSecret": " ... ",
  "fb": {
    "clientID" : " ... ",
    "clientSecret": " ... ",
    "callbackURL": "// ... ",
    "profileFields": ["id", "displayName", "photos"]
  },
  "google": {
    "clientID" : " ... ",
    "clientSecret": " ... ",
    "callbackURL": "// ... ",
    "profileFields": ["id", "displayName", "photos"]
  },
  "twitter": {
    "consumerKey" : " ... ",
    "consumerSecret": " ... ",
    "callbackURL": "// ... ",
    "profileFields": ["id", "displayName", "photos"]
  },
  ,
  "redis": {
    "host": "127.0.0.1",
    "port": 6379,
    "password": ""
  }
}


 */