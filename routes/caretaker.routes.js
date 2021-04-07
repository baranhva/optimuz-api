"use strict";

module.exports = function(Router, CaretakerController) {

    const router = Router();

    router.get('/patients', CaretakerController.getPatients);


    return router;
};
