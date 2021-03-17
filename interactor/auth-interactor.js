'use strict';

const _ = require('lodash');

module.exports = function(UserService, HashService, TokenService, RedisClient) {

    let svc = {};

    svc.error = {
        incorrectPassword: new Error(`The password that was given is incorrect`)
    };

    svc.getSession = async function(email, password) {
        const user = await UserService.findUserByEmail(email);
        const hashedPassword = _.get(user, 'password');
        await compareGivenPasswordToHashedPassword(password, hashedPassword);
        const payload = _.pick(user.toJSON(), ['id', 'email', 'type']);
        return await getTokensAndStoreRefreshToken(user.id, payload);
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

    return svc;
};
