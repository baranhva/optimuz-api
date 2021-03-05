"use strict";

module.exports = function(config, UserService, HashService) {

    let interactor = {};

    interactor.createPatientAccount = function(email, password, firstName, lastName) {
        const hashedPassword = await HashService.hash(password);
        const type = config.user.types.patient;
        const user = await UserService.createUser(email, hashedPassword, firstName, lastName, type);
    };

    return interactor;
};