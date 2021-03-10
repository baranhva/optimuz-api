"use strict";

module.exports = function(config, jwt) {

    let svc = {};

    svc.sign = async function(payload) {
        try {
            return await jwt.sign(payload, config.jwt.secretKey, config.jwt.options);
        } catch (err) {
            throw err;
        }
    };

    svc.verify = function(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.jwt.secretKey, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
    };

    return svc;
};
