"use strict";

module.exports = function(config, UserService) {

    let interactor = {};

    interactor.createPatientAccount = async function(email, password, firstName, lastName) {
        const type = config.user.types.patient;
        return await UserService.createUser(email, password, firstName, lastName, type);
    };

    return interactor;
};
