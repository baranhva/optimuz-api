"use strict";

module.exports = function(PatientInteractor) {

    let ctrl = {};

    ctrl.performTest = async function(req, res) {
        console.log(`* performTest is called *`);
        res.json({ msg: "The returned result" });
    }

    ctrl.createPatientAccount = async function(req, res) {
        try {
            const {email, password, firstName, lastName} = req.body;
            await PatientInteractor.createPatientAccount(email, password, firstName, lastName);
            res.json({ successful: true });
        } catch (err) {
            res.sendStatus(500);
        }
    };

    return ctrl;
};
