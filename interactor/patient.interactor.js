
module.exports = function (config, MedicineService, UserService) {

    let interactor = {};

    interactor.createPatientAccount = async function (email, password, firstName, lastName) {
        const type = config.user.types.patient;
        return await UserService.createUser(email, password, firstName, lastName, type);
    };

    interactor.createMedicineAndLinkToPatient = async function (userId, name, amountOfUnit, unit, amountPerPackage) {
        return await MedicineService.createMedicineAndLinkToPatient(userId, name, amountOfUnit, unit, amountPerPackage);
    };

    return interactor;
};
