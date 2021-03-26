'use strict';

const _ = require('lodash');

module.exports = function(UserService, HashService, TokenService, RedisClient) {

    let svc = {};

    svc.error = {
        incorrectPassword: new Error(`The password that was given is incorrect`),
        noRefreshTokenStored: new Error(`There is no token stored`),
        oldRefreshToken: new Error(`Old token. Not valid anymore`),
    };

    svc.verify = function(token) {
        return TokenService.verifyAccessToken(token);
    };

    svc.decodePayload = function(token) {
        return TokenService.decodePayload(token);
    }

    svc.getSession = async function(email, password) {
        const user = await UserService.findUserByEmail(email);
        const hashedPassword = _.get(user, 'password');
        await compareGivenPasswordToHashedPassword(password, hashedPassword);
        const payload = _.pick(user.toJSON(), ['id', 'email', 'type']);
        return await getTokensAndStoreRefreshToken(user.id.toString(), payload);
    }

    async function compareGivenPasswordToHashedPassword(givenPassword, hashedPassword) {
        const isEqual = await HashService.compare(givenPassword, hashedPassword);
        if (!isEqual) {
            throw svc.error.incorrectPassword;
        }

        return true;
    }

    async function getTokensAndStoreRefreshToken(userId, payload) {
        const {accessToken, refreshToken} = await TokenService.sign(userId, payload);
        await RedisClient.setAsync(userId, refreshToken);
        return {accessToken, refreshToken};
    }

    svc.extractTokenFromAuthorizationHeader = function(authHeader) {
        if (authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7, authHeader.length);
        } else {
            throw new Error(`The authorization header does not start with 'Bearer'`)
        }
    };

    svc.reIssueTokens = async function(refreshToken){
        const payload = await TokenService.verifyRefreshToken(refreshToken);
        const userId = payload.aud;
        const storedToken = await RedisClient.getAsync(userId);

        if (!storedToken)
            throw svc.error.noRefreshTokenStored;
        if (storedToken !== refreshToken)
            throw svc.error.oldRefreshToken;

        return await getTokensAndStoreRefreshToken(userId, payload);
    };

    return svc;
};
