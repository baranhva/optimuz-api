"use strict";

const _ = require('lodash');

module.exports = function(config, db, UserService, CaretakerPatientLinkService) {

    let interactor = {};

    interactor.getLinkedPatients = async function(caretakerId) {
        const patients = await CaretakerPatientLinkService.getPatientsLinkedToCaretaker(caretakerId);
        return await UserService.findUsersById(patients);
    };

    interactor.createPatientAccountAndLinkToCaretaker = async function(caretakerId, email, password, firstName, lastName) {
        const transaction = await db.transaction();

        try {
            const type = config.user.types.patient;
            const patient = await UserService.createUser(email, password, firstName, lastName, type, transaction);
            await CaretakerPatientLinkService.linkPatientToCaretaker(patient.id.toString(), caretakerId, transaction);
            await transaction.commit();
            return _.omit(patient.toJSON(), ['password']);
        } catch (error) {
            console.error(error);
            await transaction.rollback();
        }
    };

    return interactor;
};
