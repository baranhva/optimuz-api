"use strict";

module.exports = function(Router, AdminController) {

    const router = Router();

    router.get('/users', AdminController.getAllUsers);


    return router;
};
