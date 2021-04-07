
const {clean} = require("../util/tools");

module.exports = function(config, CaretakerPatientLink, UserService) {

    let svc = {};

    svc.error = {
        incorrectUserType: new Error(`The given user type is not a correct one`)
    };

    svc.linkPatientToCaretaker = async function(patientId, caretakerId, transaction = null) {
        if (!await UserService.isUserType(patientId, config.user.types.patient, transaction)) throw svc.error.incorrectUserType;
        if (!await UserService.isUserType(caretakerId, config.user.types.caretaker, transaction)) throw svc.error.incorrectUserType;
        return await CaretakerPatientLink.create({patientId, caretakerId}, clean({transaction}));
    };

    return svc;
}
