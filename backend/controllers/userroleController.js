"use strict";
const UserRoleSchema = require("../models/userroleModel");
const mongoose = require("mongoose");
const apiResponse = require("../helpers/apiResponse");

const UserRole = mongoose.model("UserRole", UserRoleSchema);

exports.createUserRole = (req, res) => {
  //Validate request
  if (!req.body) {
    return apiResponse.ErrorResponse(res, "User Role cannot be empty....");
  }

  const userrole = new UserRole(req.body);
  userrole._id = new mongoose.Types.ObjectId();

  userrole
    .save()
    .then((role) => {
      return apiResponse.successResponseWithData(
        res,
        "Created new user role",
        role
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getUserRoleList = (req, res) => {
  UserRole.find()
    .then((roles) => {
      if (typeof roles === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved all user roles",
          []
        );
      } else {
        if (roles.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all user roles",
            roles
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all user roles",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.updateUserRole = (req, res) => {
  UserRole.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  })
    .then((role) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved updates to user role",
        role
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};
