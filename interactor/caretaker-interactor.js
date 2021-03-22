"use strict";

module.exports = function(config, db, UserService) {

    let interactor = {};

    interactor.createPatientAccountAndLinkToCaretaker = async function(uid, email, password, firstName, lastName) {
        const transaction = await db.transaction();

        try {
            const type = config.user.types.patient;
            const user = await UserService.createUserUsingTransaction(email, password, firstName, lastName, type, transaction);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
        }

    };

    return interactor;
};
