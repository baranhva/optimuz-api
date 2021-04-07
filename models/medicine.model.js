module.exports = function(db, DataTypes) {

    return db.define('Medicine', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amountOfUnit: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        unit: {
            type: DataTypes.ENUM(['Kg', 'g', 'mg', 'mcg', ' L', 'ml', 'cc', 'mol', 'mmol']),
            allowNull: false,
        },
        amountPerPackage: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}
