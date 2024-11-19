const express = require("express");
const router = express.Router();

const {
  createMeeting,
  updateMeeting,
  getMeetingDetail,
} = require("../../controllers/meetingController");

router
  .route("/meetingdate/:meetingdate")
  // Update an existing meeting
  .get(getMeetingDetail);

router
  .route("/:id")
  // Update Meeting details
  .put(updateMeeting);

router
  .route("/")
  // Create new meeting
  .post(createMeeting);

module.exports = router;
