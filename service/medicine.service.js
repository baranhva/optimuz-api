"use strict";


module.exports = function(db, Medicine, UserMedicine) {

    async function createMedicineAndLinkToPatient(userId, name, amountOfUnit, unit, amountPerPackage) {
        try {
            const transaction = await db.transaction();
            const medicine = await createMedicine(name, amountOfUnit, unit, amountPerPackage, transaction);
            await linkMedicineToUser(userId, medicine.id.toString(), transaction);
            await transaction.commit();
            return medicine.toJSON();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async function createMedicine(name, amountOfUnit, unit, amountPerPackage, transaction) {
        return Medicine.create({
            name: name, amountOfUnit: amountOfUnit, unit: unit, amountPerPackage: amountPerPackage
        }, { transaction: transaction });
    }

    async function linkMedicineToUser(userId, medicineId, transaction) {
        return UserMedicine.create({
            user: userId,
            medicine: medicineId
        }, { transaction: transaction });
    }

    return {
        createMedicineAndLinkToPatient
    };
}
