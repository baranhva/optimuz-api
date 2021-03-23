"use strict";

const {clean} = require("../util/tools");

const _ = require('lodash');

module.exports = function (User, HashService) {

    let svc = {};

    svc.findUserByEmail = async function (email) {
        const result = await User.findOne({where: {email}});
        if (!result) {
            throw new Error(`There is no user stored for the given email`);
        }

        return result;
    };

    svc.createUser = async function (email, password, firstName, lastName, type) {
        const hashedPassword = await HashService.hash(password);
        return await svc.createUserInstance(email, hashedPassword, firstName, lastName, type);
    };

    svc.createUserUsingTransaction = async function(email, password, firstName, lastName, type, transaction) {
        const hashedPassword = await HashService.hash(password);
        return await svc.createUserInstance(email, hashedPassword, firstName, lastName, type, transaction);
    };

    svc.createUserInstance = async function (email, password, firstName, lastName, type, transaction = null) {
        return await User.create({email, password, firstName, lastName, type}, clean({transaction}));
    };

    svc.getAllUsers = async function() {
        return await User.findAll({
            attributes: {exclude: ['password']},
            order: [['id', 'DESC']]
        });
    };

    return svc;
};
