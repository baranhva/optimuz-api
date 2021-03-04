"use strict";

module.exports = function(db, DataTypes, config) {

    const User = db.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false
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
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM([config.user.types.ADMIN, config.user.types.CARE_TAKER, config.user.types.PATIENT]),
            allowNull: false
        }
    }, {
        // Other model options go here
    });

    return User;
}
