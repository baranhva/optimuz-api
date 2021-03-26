"use strict";

module.exports = function(db, DataTypes, User, Medicine) {

    const UserMedicine = db.define('UserMedicine', {});

    User.belongsToMany(Medicine, { through: UserMedicine, foreignKey: 'user' });
    Medicine.belongsToMany(User, { through: UserMedicine, foreignKey: 'medicine' });

    return UserMedicine;
}
