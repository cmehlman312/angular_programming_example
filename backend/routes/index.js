// "use strict";

// // const authToken = require("../auth/auth.js");

// // example found in link below
// // https://medium.com/@sesitamakloe/how-we-structure-our-express-js-routes-58933d02e491

// module.exports = function (app) {
//   // app.use("/api/",authToken.verifyToken,require("./api"));
//   app.use("/api", require("./api"));
// };

"use strict";

const router = require("express").Router();

router.use("/api", require("./api"));

module.exports = router;
