"use strict";

module.exports = function(Router, CaretakerController) {

    const router = Router();

    router.get('/patients', CaretakerController.getPatients);

    router.post('/patients', CaretakerController.createPatient);

    return router;
};
