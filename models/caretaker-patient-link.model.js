
module.exports = function(db, DataTypes, User) {

    const CaretakerPatientLink = db.define('CaretakerPatientLink', {});

    User.belongsToMany(User, { through: CaretakerPatientLink, as: "caretaker", foreignKey: "id" });
    User.belongsToMany(User, { through: CaretakerPatientLink, as: "patient", foreignKey: "id" });

    return CaretakerPatientLink;
}
