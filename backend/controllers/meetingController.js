"use strict";
const MeetingSchema = require("../models/meetingModel");
const mongoose = require("mongoose");
const apiResponse = require("../helpers/apiResponse");

const Meeting = mongoose.model("Meeting", MeetingSchema);

exports.createMeeting = (req, res) => {
  //Validate request
  if (!req.body) {
    return apiResponse.ErrorResponse(res, "Meeting cannot be empty....");
  }

  const meeting = new Meeting(req.body);
  meeting._id = new mongoose.Types.ObjectId();

  meeting
    .save()
    .then((meeting) => {
      return apiResponse.successResponseWithData(
        res,
        "Created new meeting",
        meeting
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getMeetingDetail = (req, res) => {
  Meeting.find({ meeting_date: req.params.meetingdate })
    .then((meeting) => {
      if (typeof meeting === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved meeting detail",
          []
        );
      } else {
        if (meeting.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved meeting detail",
            meeting
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved meeting detail",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.updateMeeting = (req, res) => {
  Meeting.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  })
    .then((meeting) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved updates to meeting",
        meeting
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};
