"use strict";

module.exports = {
    db: {
      url: ''
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
