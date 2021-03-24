"use strict";

const _ = require('lodash');

module.exports = function(config, jwt) {

    let svc = {};

    svc.sign = async function(userId, payload) {
        const [accessToken, refreshToken] = await Promise.all([
            svc.signAccessToken(userId, payload), svc.signRefreshToken(userId, payload)
        ]);
        return {accessToken, refreshToken};
    }

    svc.signAccessToken = async function(userId, payload) {
        return signToken(userId, payload, config.jwt.secretAccessTokenKey, '15m');
    }

    svc.signRefreshToken = async function(userId, payload) {
        return signToken(userId, payload, config.jwt.secretRefreshTokenKey, '60d');
    }

    async function signToken(userId, payload, secretKey, expiresIn){
        try {
            return await jwt.sign(payload, secretKey, {
                expiresIn: expiresIn,
                subject: userId,
                audience: userId
            });
        } catch (err) {
            throw err;
        }
    }

    svc.verify = function(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.jwt.secretKey, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    };

    svc.decodePayload = function(token) {
        const decoded = jwt.decode(token, {complete: true});
        return _.get(decoded, 'payload');
    }

    return svc;
};
