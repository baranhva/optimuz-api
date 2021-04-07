"use strict";

module.exports = function(Router, CaretakerController) {

    const router = Router();

    router.post('/patient', CaretakerController.createPatient);

    return router;
};
