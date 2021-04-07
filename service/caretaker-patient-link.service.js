
const {clean} = require("../util/tools");

module.exports = function(config, CaretakerPatientLink, UserService) {

    let svc = {};

    svc.error = {
        incorrectUserType: new Error(`The given user type is not a correct one`)
    };

    svc.linkPatientToCaretaker = async function(patientId, caretakerId, transaction = null) {
        if (!await UserService.isUserType(patientId, config.user.type.patient)) throw error.incorrectUserType;
        if (!await UserService.isUserType(caretakerId, config.user.type.caretaker)) throw error.incorrectUserType;
        return await CaretakerPatientLink.create({patientId, caretaker: caretakerId}, clean({transaction}));
    };

    return svc;
}
