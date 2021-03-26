"use strict";

module.exports = function(config, Router, PatientController, AuthMiddleware) {

    const router = Router();

    router.post('/register', PatientController.createPatientAccount);

    router.use(AuthMiddleware.authenticationMiddleware);
    router.use(AuthMiddleware.userTypeAccessMiddleware([config.user.types.patient]));

    router.post(`/medicine`, PatientController.createMedicine);

    return router;
};
