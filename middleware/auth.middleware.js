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

    function userTypeAccessMiddleware(types) {
        if (!types || types.constructor !== Array || types.length === 0) {
            throw new Error(`The provided types: ${types} are incorrect`);
        }

        return async function(req, res, next) {
            if (!!req.auth.type && isNeededUserType(types, req.auth.type)) {
                next();
            } else {
                console.log(`The user with type: ${req.auth.type} did not have a correct type: ${types}`);
                res.sendStatus(403);
            }
        }
    }

    function isNeededUserType(types, userType) {
        return !!types.find(type => type === userType);
    }


    return {
        authenticationMiddleware,
        userTypeAccessMiddleware
    };
};
