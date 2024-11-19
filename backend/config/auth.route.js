const OktaJwtVerifier = require("@okta/jwt-verifier");

const { resourceServer } = require("./vars");

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: resourceServer.oidc.clientId,
  issuer: resourceServer.oidc.issuer,
  assertClaims: resourceServer.assertClaims,
});

/**
 * A simple middleware that asserts valid access tokens and sends 401 responses
 * if the token is not present or fails validation.  If the token is valid its
 * contents are attached to req.jwt
 */
function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next("Unauthorized");
  }

  const accessToken = match[1];
  const audience = sampleConfig.resourceServer.assertClaims.aud;
  return oktaJwtVerifier
    .verifyAccessToken(accessToken, audience)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}

module.exports = authenticationRequired;
