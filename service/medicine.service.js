"use strict";


module.exports = function(db, Medicine, UserMedicine) {

    async function createMedicineAndLinkToPatient(userId, name, amountOfUnit, unit, amountPerPackage) {
        const transaction = await db.transaction();

        try {
            const medicine = await createMedicine(name, amountOfUnit, unit, amountPerPackage, transaction);
            await linkMedicineToUser(userId, medicine.id.toString(), transaction);
            await transaction.commit();
            return medicine.toJSON();
        } catch (err) {
            console.error(err);
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
            UserId: userId,
            MedicineId: medicineId
        }, { transaction: transaction });
    }

    return {
        createMedicineAndLinkToPatient
    };
}
