"use strict";

module.exports = function(UserService) {

    let interactor = {};

    interactor.getAllUsers = async function() {
        return UserService.getAllUsers();
    };

    return interactor;
};
