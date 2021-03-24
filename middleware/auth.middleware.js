"use strict";

module.exports = function(AuthInteractor) {

    async function authenticationMiddleware(req, res, next) {
        if (!req.headers.authorization) {
            console.log(`Is missing authorization header`);
            return res.sendStatus(401);
        }

        try {
            await AuthInteractor.verify(req.headers.authorization)
            req.auth = AuthInteractor.decodePayload(req.headers.authorization);
            next();
        } catch (err) {
            console.log(`Error happened when verifying & decoding the payload`)
            return res.sendStatus(401);
        }
    }


    return {
        authenticationMiddleware
    };
};
