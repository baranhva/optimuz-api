"use strict";

module.exports = function(User, HashService) {

    let svc = {};

    svc.createUser = async function(email, password, firstName, lastName, type) {
        const user = await User.create({ email, password, firstName, lastName, type});
        return user;
    };

    return svc;
};