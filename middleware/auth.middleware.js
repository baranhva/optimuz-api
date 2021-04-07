
module.exports = function(AuthInteractor) {

    async function authenticationMiddleware(req, res, next) {
        if (!req.headers.authorization) {
            return res.sendStatus(401);
        }

        try {
            const token = AuthInteractor.extractTokenFromAuthorizationHeader(req.headers.authorization);
            await AuthInteractor.verify(token);
            req.auth = AuthInteractor.decodePayload(token);
            next();
        } catch (err) {
            console.error(err);
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
