"use strict";
const UserSchema = require("../models/userModel");
const mongoose = require("mongoose");
const apiResponse = require("../helpers/apiResponse");

const User = mongoose.model("User", UserSchema);

const { sendAccessRequestMessage } = require("./mailController");

exports.createUser = (req, res) => {
  const newuser = new User(req.body);
  newuser._id = new mongoose.Types.ObjectId();

  newuser
    .save()
    .then((person) => {
      // sendAccessRequestMessage(req, res,
      //   tempUser["firstname"] + " " + tempUser["lastname"],
      //   tempUser["accessreason"]
      // );
      return apiResponse.successResponseWithData(
        res,
        "Created new user",
        person
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getUserList = (req, res) => {
  User.find()
    .then((persons) => {
      if (typeof persons === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved all users",
          []
        );
      } else {
        if (persons.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all users",
            persons
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all users",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.updateUser = (req, res) => {

console.log('initial');
    console.log(req.body);
  // req.body.active = req.body.active === "true";
  // req.body.admin = req.body.admin === "true";
  // req.body.access_requested = req.body.access_requested === "true";
  req.body.modified_date = new Date().toISOString();

  console.log('after:');
  console.log(req.body);

  User.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  })
    .then((person) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved updates to user",
        person
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getUserById = (req, res) => {
  let query = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $addFields: {
        fullname: { $concat: ["$firstname", " ", "$lastname"] },
      },
    },
  ];

  User.aggregate(query)
    .then((user) => {
      if (typeof user === "undefined") {
        return apiResponse.successResponseWithData(res, "Retrieved user", []);
      } else {
        return apiResponse.successResponseWithData(res, "Retrieved user", user);
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getUserEmailInformation = (req, res) => {
  let userArray = req.query.users.split(", ");

  let query = [
    {
      $project: {
        fullname: { $concat: ["$firstname", " ", "$lastname"] },
        firstname: "$firstname",
        email: 1,
        _id: 1,
      },
    },
    {
      $match: {
        fullname: {
          $in: userArray,
        },
      },
    },
  ];

  User.aggregate(query)
    .then((emails) => {
      if (typeof emails === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved user email list",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved user email list",
          emails
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getUserInformation = (req, res) => {
  let tempid = req.params.userid;
  // let tempnames = tempid.split(" ");

  User.findOne(
    { userid: tempid },
    // { firstname: tempnames[0], lastname: tempnames[1] },
    {
      _id: 1,
      userid: 1,
      username: 1,
      firstname: 1,
      lastname: 1,
      fullname: { $concat: ["$firstname", " ", "$lastname"] },
      email: 1,
      affliliation: 1,
      accessreason: 1,
      access_requested: 1,
      granted_by: 1,
      active: 1,
      role: 1,
      admin: 1,
      modified_date: 1,
      create_date: 1,
    }
  )
    .then((user) => {
      return apiResponse.successResponseWithData(
        res,
        "Found user information matching the userid",
        user
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.grantAccess = (req, res) => {
  req.body.modified_date = new Date().toISOString();
  User.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  })
    .then((person) => {
      return apiResponse.successResponseWithData(
        res,
        "Granted user access successful.",
        person
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.revokeAccess = (req, res) => {
  req.body.modified_date = new Date().toISOString();
  User.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  })
    .then((person) => {
      return apiResponse.successResponseWithData(
        res,
        "Revoked user access successful.",
        person
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getAdminEmailList = (req, res) => {
  let userArray = req.query.users.split(", ");

  let query = [
    {
      $match: {
        admin: true,
      },
    },
    {
      $project: {
        email: 1,
        _id: 0,
      },
    },
  ];

  User.aggregate(query)
    .then((emails) => {
      if (typeof emails === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved user email list",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved user email list",
          emails
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};
