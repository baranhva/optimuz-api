"use strict";

const _ = require('lodash');

module.exports = function(config, UserService) {

    let interactor = {};

    interactor.getAllUsers = async function() {
        return UserService.getAllUsers();
    };

    interactor.createCaretakerAccount = async function(email, firstName, lastName) {
        const type = config.user.types.caretaker;
        const user = await UserService.createUser(email, "password", firstName, lastName, type);
        return _.omit(user.toJSON(), ['password']);
    };

    return interactor;
};
