"use strict";
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const error = require("../middlewares/error");

const { secret } = require("./vars");

// initialize express app
const app = express();

// secure apps by setting various HTTP headers
app.use(helmet());

app.use(cookieParser());

// Setup app to handle CORS
app.use(cors());

// setup express bodyparser
app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json({ limit: "100mb" }));

//Initialize passport in express
app.use(passport.initialize());
// app.use(passport.session({ secret: secret }));

// cookieParser should be above session
app.use(cookieParser());

app.use(
  session({
    secret: secret,
    // proxy: true,
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: "strict" },
  })
);

//  Log all server requests
const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    console.info(
      `${res.statusCode} ${res.statusMessage}; ${
        res.get("Content-Length") || 0
      }b sent`
    );
  });

  next();
};

app.use(logRequestStart);

// serving static files
app.use(express.static("public"));

// Setup routes
app.use(require("../routes"));

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
