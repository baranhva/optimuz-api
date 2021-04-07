const {clean} = require("../util/tools");
const _ = require('lodash');

module.exports = function(config, CaretakerPatientLink, UserService) {

    let svc = {};

    svc.error = {
        incorrectUserType: new Error(`The given user type is not a correct one`)
    };

    svc.getPatientsLinkedToCaretaker = async function(caretakerId) {
        const caretakerPatientLinks = await CaretakerPatientLink.findAll({where: {caretakerId}});
        return caretakerPatientLinks.map(item => item.patientId.toString());
    };

    svc.linkPatientToCaretaker = async function(patientId, caretakerId, transaction = null) {
        if (!await UserService.isUserType(patientId, config.user.types.patient, transaction)) throw svc.error.incorrectUserType;
        if (!await UserService.isUserType(caretakerId, config.user.types.caretaker, transaction)) throw svc.error.incorrectUserType;
        return await CaretakerPatientLink.create({patientId, caretakerId}, clean({transaction}));
    };

    return svc;
}
