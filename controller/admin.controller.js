
module.exports = function(AdminInteractor) {

    let ctrl = {};

    ctrl.getAllUsers = async function(req, res) {
        try {
            const users = await AdminInteractor.getAllUsers();
            res.json(users);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    };

    ctrl.createCaretaker = async function(req, res) {
        try {
            const {email, firstName, lastName} = req.body;
            const user = await AdminInteractor.createCaretakerAccount(email, firstName, lastName);
            res.json(user);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    };

    return ctrl;
};
