"use strict";

module.exports = {
    db: {
      url: ''
    },
    logging: {
      network: {
        simple: ':method - :url - :status - :response-time ms - :res[content-length] - :date[iso] - :remote-addr',
        detailed: ':remote-addr - :remote-user [:date[iso]] ":method - :url" :status - :response-time ms - :res[content-length] ":referrer" ":user-agent"'
      }
    },
    user: {
      types: {
          admin: "ADMIN",
          caretaker: "CARE_TAKER",
          patient: "PATIENT"
      }
    },
    jwt: {
        secretKey: 'J4d-B^EJfFgCM?GF2ATNAEH@mvFm%EzHn5dn3Hk-?g#^7',
        options: {
            expiresIn: '16h'
        }
    }
}
