"use strict";

const SALT_NUMBER = 15;

module.exports = function(bcryptjs) {

    let svc = {};

    svc.hash = async function(value) {
        const salt = await bcryptjs.genSalt(SALT_NUMBER);
        return await salt.hash(value, salt);
    };

    svc.compare = async function(givenValue, hashedValue) {
        const valid = await bcryptjs.compare(givenValue, hashedValue);
        return valid === true;
    };

    return svc;
};
