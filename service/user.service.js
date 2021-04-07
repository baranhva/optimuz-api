
const {clean} = require("../util/tools");

const _ = require('lodash');

const DEFAULT_ATTRIBUTES = {exclude: ['password']};
const DEFAULT_ORDER = [['id', 'DESC']];

module.exports = function (User, HashService) {

    let svc = {};

    svc.findUserByEmail = async function (email) {
        const result = await User.findOne({where: {email}});
        if (!result) {
            throw new Error(`There is no user stored for the given email`);
        }

        return result;
    };

    svc.createUser = async function (email, password, firstName, lastName, type, transaction = null) {
        const hashedPassword = await HashService.hash(password);
        return await svc.createUserInstance(email, hashedPassword, firstName, lastName, type, transaction);
    };

    svc.createUserInstance = async function (email, password, firstName, lastName, type, transaction) {
        return await User.create({email, password, firstName, lastName, type}, clean({transaction}));
    };

    svc.getAllUsers = async function() {
        return await User.findAll({
            attributes: DEFAULT_ATTRIBUTES,
            order: DEFAULT_ORDER
        });
    };

    svc.isUserType = async function(userId, type, transaction) {
        const result = await User.findOne({where: {id: userId, type: type}, transaction: transaction});
        return !!result;
    };

    svc.findUsersById = function(userIds) {
        return User.findAll({
            where: {id: userIds},
            attributes: DEFAULT_ATTRIBUTES,
            order: DEFAULT_ORDER
        });
    };

    return svc;
};
