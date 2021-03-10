"use strict";

module.exports = function(Router, AuthController) {

    const router = Router();

    router.get('/login', AuthController.login);

    return router;
};
