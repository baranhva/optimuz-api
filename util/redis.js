"use strict";

const {promisify} = require('util');

module.exports = function(redis) {

    const client = redis.createClient(process.env.REDIS_URL);

    return {
        ...client,
        getAsync: promisify(client.get).bind(client),
        setAsync: promisify(client.set).bind(client),
        keysAsync: promisify(client.set).bind(client),
    }
}
