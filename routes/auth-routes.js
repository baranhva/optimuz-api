"use strict";

module.exports = function(Router, AuthController) {

    const router = Router();

    router.post('/login', AuthController.login);

    return router;
};
