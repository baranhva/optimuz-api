'use strict';

module.exports = function(AuthInteractor) {

    let ctrl = {};

    ctrl.login = async function(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send(`The given input is incorrect`);
        }

        try {
            const {accessToken, refreshToken} = await AuthInteractor.getSession(req.body.email, req.body.password);
            res.json({ accessToken, refreshToken });
        } catch(err) {
            if (err === AuthInteractor.error.incorrectPassword) {
                console.error(new Error(`Incorrect password given by ${req.body.email}`));
                return res.status(403).send(`Given input is incorrect`);
            } else {
                console.error(new Error(`An error occurred during authentication`));
                return res.status(500).send(`An error occurred during authentication`);
            }
        }
    };

    return ctrl;
};
