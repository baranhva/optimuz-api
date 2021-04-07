
module.exports = function(db, DataTypes, User, Medicine) {

    const UserMedicine = db.define('UserMedicine', {});

    User.belongsToMany(Medicine, { through: UserMedicine });
    Medicine.belongsToMany(User, { through: UserMedicine });

    return UserMedicine;
}
