"use strict";
const SpecialtySchema = require("../models/specialtyModel");
const mongoose = require("mongoose");
const apiResponse = require("../helpers/apiResponse");

const Specialty = mongoose.model("Specialty", SpecialtySchema);

exports.createSpecialty = (req, res) => {
  //Validate request
  if (!req.body) {
    return apiResponse.ErrorResponse(res, "Specialty cannot be empty....");
  }

  const specialty = new Specialty(req.body);
  specialty._id = new mongoose.Types.ObjectId();

  specialty
    .save()
    .then((specialty) => {
      return apiResponse.successResponseWithData(
        res,
        "Created new specialty",
        specialty
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getSpecialtyList = (req, res) => {
  Specialty.find()
    .then((specialties) => {
      if (typeof specialties === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved all specialties",
          []
        );
      } else {
        if (specialties.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all specialties",
            specialties
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all specialties",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.updateSpecialty = (req, res) => {
  Specialty.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  })
    .then((specialty) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved updates to specialty",
        specialty
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};
