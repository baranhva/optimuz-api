"use strict";

module.exports = function(config, db, DataTypes) {

    const User = db.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM([config.user.types.admin, config.user.types.caretaker, config.user.types.patient]),
            allowNull: false
        }
    }, {
        // Other model options go here
    });

    return User;
}
