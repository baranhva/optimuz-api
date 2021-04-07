"use strict";

module.exports = function(CaretakerInteractor) {

    let ctrl = {};

    ctrl.createPatient = async function(req, res) {
        try {
            const caretakerId = req.auth.id;
            const {email, firstName, lastName} = req.body;
            const patient = await CaretakerInteractor.createPatientAccountAndLinkToCaretaker(caretakerId, email, "password", firstName, lastName);
            res.json(patient);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    };

    return ctrl;
};
