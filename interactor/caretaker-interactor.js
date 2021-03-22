"use strict";

module.exports = function(config, UserService) {

    let interactor = {};

    interactor.createPatientAccountAndLinkToCaretaker = async function(uid, email, password, firstName, lastName) {
        const type = config.user.types.patient;
        const user = await UserService.createUser(email, password, firstName, lastName, type);
    };

    return interactor;
};
