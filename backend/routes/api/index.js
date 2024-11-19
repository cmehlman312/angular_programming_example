"use strict";

const ApiRouter = require("express").Router();
const { authenticationRequired } = require("../../config/auth.route");

ApiRouter.use("/meeting", require("./meetingRoutes"));
ApiRouter.use("/specialty", require("./specialtyRoutes"));
ApiRouter.use("/therapyplan", require("./therapyplanRoutes"));
ApiRouter.use("/userrole", require("./userroleRoutes"));
ApiRouter.use("/user", require("./userRoutes"));
ApiRouter.use("/mail", require("./mailRoutes"));

module.exports = ApiRouter;
