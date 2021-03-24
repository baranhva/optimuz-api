"use strict";

module.exports = function(AdminInteractor) {

    let ctrl = {};

    ctrl.getAllUsers = async function(req, res) {
        try {
            const users = await AdminInteractor.getAllUsers();
            res.json({ users });
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    };

    return ctrl;
};
