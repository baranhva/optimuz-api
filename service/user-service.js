"use strict";

const _ = require('lodash');

module.exports = function(User, HashService) {

    let svc = {};

    svc.findUserByEmail = async function(email) {
        const result = await User.findOne({ where: { email }});
        if (!result) {
            throw new Error(`There is no user stored for the given email`);
        }

        return result;
    };

    svc.createUser = async function(email, password, firstName, lastName, type) {
        const hashedPassword = await HashService.hash(password);
        return await svc.createUserInstance(email, hashedPassword, firstName, lastName, type);
    };

    svc.createUserInstance = async function(email, password, firstName, lastName, type) {
        const user = await User.create({ email, password, firstName, lastName, type});
        return user;
    };

    return svc;
};
