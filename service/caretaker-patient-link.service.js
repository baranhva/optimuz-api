
const {clean} = require("../util/tools");

module.exports = function(config, CaretakerPatientLink, UserService) {

    let svc = {};

    svc.error = {
        incorrectUserType: new Error(`The given user type is not a correct one`)
    };

    svc.linkPatientToCaretaker = async function(patient, caretaker, transaction = null) {
        if (!await UserService.isUserType(patient, config.user.type.patient)) throw error.incorrectUserType;
        if (!await UserService.isUserType(caretaker, config.user.type.caretaker)) throw error.incorrectUserType;
        return await CaretakerPatientLink.create({patient, caretaker}, clean({transaction}));
    };

    return svc;
}
