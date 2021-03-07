"use strict";

module.exports = function(Router, PatientController) {

    const router = Router();

    router.get('/test', PatientController.performTest);
    router.post('/register', PatientController.createPatientAccount);


    return router;
};
