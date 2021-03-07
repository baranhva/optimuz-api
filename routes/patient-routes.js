"use strict";

module.exports = function(Router, PatientController) {

    const router = Router();
    

    router.post('/register', PatientController.createPatientAccount);


    return router;
};
