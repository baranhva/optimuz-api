'use strict';

const _ = require('lodash');

module.exports = function(UserService, HashService, TokenService) {

    let svc = {};

    svc.error = {
        incorrectPassword: new Error(`The password that was given is incorrect`)
    };

    svc.getSession = async function(email, password) {
        const user = await UserService.findUserByEmail(email);
        const hashedPassword = _.get(user, 'password');
        await compareGivenPasswordToHashedPassword(password, hashedPassword);
        const tokenPayload = _.pick(user.toJSON(), ['id', 'email', 'type']);
        return TokenService.sign(tokenPayload);
    }

    async function compareGivenPasswordToHashedPassword(givenPassword, hashedPassword) {
        const isEqual = await HashService.compare(givenPassword, hashedPassword);
        if (!isEqual) {
            throw svc.error.incorrectPassword;
        }

        return true;
    }

    return svc;
};
