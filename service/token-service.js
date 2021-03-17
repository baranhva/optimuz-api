"use strict";

module.exports = function(config, jwt) {

    let svc = {};

    svc.sign = async function(userId, payload) {
        const [accessToken, refreshToken] = await Promise.all([
            svc.signAccessToken(userId, payload), svc.signRefreshToken(userId, payload)
        ]);
        return {accessToken, refreshToken};
    }

    svc.signAccessToken = async function(userId, payload) {
        return signToken(userId, payload, config.jwt.secretAccessTokenKey, '1h');
    }

    svc.signRefreshToken = async function(userId, payload) {
        return signToken(userId, payload, config.jwt.secretRefreshTokenKey, '60d');
    }

    async function signToken(userId, payload, secretKey, expiresIn){
        try {
            return await jwt.sign(payload, secretKey, {
                expiresIn: expiresIn,
                audience: userId
            });
        } catch (err) {
            throw err;
        }
    }

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
