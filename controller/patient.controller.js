"use strict";

module.exports = function(PatientInteractor) {

    let ctrl = {};

    ctrl.createPatientAccount = async function(req, res) {
        try {
            const {email, password, firstName, lastName} = req.body;
            await PatientInteractor.createPatientAccount(email, password, firstName, lastName);
            res.json({ successful: true });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    };

    ctrl.createMedicine = async function(req, res) {
        try {
            const userId = req.auth.id;
            const {name, amountOfUnit, unit, amountPerPackage} = req.body;
            await PatientInteractor.createMedicineAndLinkToPatient(userId, name, amountOfUnit, unit, amountPerPackage);
            res.json({ successful: true });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    };

    return ctrl;
};
