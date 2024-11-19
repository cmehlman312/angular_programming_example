const path = require("path");

// import .env variables
require("dotenv-safe").config({
  path: path.join(__dirname, "../.env"),
  example: path.join(__dirname, "../.env.example"),
  allowEmptyValues: true,
});

module.exports = {
  env: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  jwtSecretKey: process.env.TOKEN_SECRET_KEY,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.DATABASE_URL,
  },
  emailConfig: {
    host: process.env.SMTP,
    port: process.env.SMTP_PORT,
  },
  callback: process.env.CALLBACK_URL,
  // entrypoint: process.env.ENTRYPOINT,
  issuer: process.env.ISSUER,
  secret: process.env.SESSION_SECRET,
  siteurl: process.env.WEBSITE_URL,
  resourceServer: {
    oidc: {
      clientId: process.env.SPA_CLIENT_ID,
      issuer: process.env.SPA_ISSUER,
    },
    assertClaims: {
      aud: "api://default",
      cid: process.env.SPA_CLIENT_ID,
    },
  },
};
