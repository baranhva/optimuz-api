"use strict";

module.exports = function(config, jwt) {

    let svc = {};

    svc.sign = function(payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, config.jwt.secretKey, config.jwt.options, (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
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
