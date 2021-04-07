
module.exports = function(Router, AdminController) {

    const router = Router();

    router.get('/users', AdminController.getAllUsers);

    router.post('/caretakers', AdminController.createCaretaker);


    return router;
};
