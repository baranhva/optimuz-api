"use strict";

module.exports = {
    db: {
      url: ''
    },
    user: {
      types: {
          ADMIN: "ADMIN",
          CARE_TAKER: "CARE_TAKER",
          PATIENT: "PATIENT"
      }
    },
    jwt: {
        secretKey: 'J4d-B^EJfFgCM?GF2ATNAEH@mvFm%EzHn5dn3Hk-?g#^7',
        options: {
            expiresIn: '16h'
        }
    }
}
