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
          caretaker: "CARETAKER",
          patient: "PATIENT"
      }
    },
    jwt: {
        secretAccessTokenKey: 'J4dB^EJfFgCM?GF2ATNAEH@mvFm%EzHn5dn3Hk?g#^7Pm&E',
        secretRefreshTokenKey: 'bNT3Q4d8TpqPH@FFHxqT#c4j@Yps8HXeN!ig7!JHYnh?&58'
    }
}
