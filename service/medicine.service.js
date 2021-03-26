"use strict";


module.exports = function(db, Medicine, UserMedicine) {

    async function createMedicineAndLinkToPatient(userId, name, amountOfUnit, unit, amountPerPackage) {
        try {
            const transaction = await db.transaction();
            const medicine = await createMedicine(name, amountOfUnit, unit, amountPerPackage, transaction);
            await linkMedicineToUser(medicine.id.toString(), userId, transaction);
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
        }, {transaction});
    }

    async function linkMedicineToUser(medicineId, userId, transaction) {
        return UserMedicine.create({
            medicine: medicineId,
            user: userId
        }, { transaction: transaction });
    }

    return {
        createMedicineAndLinkToPatient
    };
}
