const express = require("express");
const router = express.Router();
const routerProtected = express.Router();

const {
  createTherapyplan,
  getTherapyplansAll,
  updateTherapyplan,
  getFutureMeetingDates,
  getFutureMeetingDetails,
  getMeetingDates,
  getMeetingAgendas,
  getPlansForMeeting,
  getTherapyPlanById,
  getTherapyplansList,
  getNextPlanNumber,
  getPlanLockStatus,
  lockPlan,
  removePlanLock,
  saveMeetingDate,
  getReviewList,
  getBuildList,
  getVerificationList,
  getAuditTrail,
  submitForReview,
  saveReviewAction,
  updateMeetingPlanVote,
  assignReviewer,
  assignBuilder,
  assignVerifier,
  saveBuildAction,
  saveVerificationAction,
} = require("../../controllers/therapyplanController");

router
  .route("/list")
  // Get lit of all Therapy Plans
  .get(getTherapyplansList);

router
  .route("/audittrail/:id")
  // Get audit trail for therapy plan
  .get(getAuditTrail);

router
  .route("/meetingdates")
  // Get lit of all Therapy Plans
  .get(getMeetingDates);

router
  .route("/meetingagenda/:agenda")
  // Get lit of all Therapy Plans
  .get(getMeetingAgendas);

router
  .route("/nextnumber")
  // Get note list
  .get(getNextPlanNumber);

router
  .route("/lockstatus/:id")
  // Get note list
  .get(getPlanLockStatus);

router
  .route("/assignreviewer/:id")
  // Assign reviewer
  .put(assignReviewer);

router
  .route("/assignbuilder/:id")
  // Assign builder
  .put(assignBuilder);

router
  .route("/assignverifier/:id")
  // Assign verifier
  .put(assignVerifier);

router
  .route("/lockplan/:id")
  // Lock therpay plan
  .put(lockPlan);

router
  .route("/unlockplan/:id")
  // Get note list
  .put(removePlanLock);

router
  .route("/futuremeetingdates")
  // Get future meeting dates
  .get(getFutureMeetingDates);

router
  .route("/futuremeetingdetails")
  // Get future meeting dates
  .get(getFutureMeetingDetails);

router
  .route("/plansformeeting/:meetingdate")
  // Get future meeting dates
  .get(getPlansForMeeting);

router
  .route("/reviewlist")
  // Get review list
  .get(getReviewList);

router
  .route("/buildlist")
  // Get build list
  .get(getBuildList);

router
  .route("/verificationlist")
  //Get verification list
  .get(getVerificationList);

router
  .route("/:id")
  // Get therapy plan by id
  .get(getTherapyPlanById)
  // Update an existing plan
  .put(updateTherapyplan);

router
  .route("/meetingdate/:id")
  // Save meeting date for plan
  .put(saveMeetingDate);

router
  .route("/submitforreview/:id")
  // Submit plan for review
  .put(submitForReview);

router
  .route("/savereviewaction/:id")
  //Save the review vote
  .put(saveReviewAction);

router
  .route("/savebuildaction/:id")
  // Save the builder action
  .put(saveBuildAction);

router
  .route("/saveverificationaction/:id")
  // Save verification action
  .put(saveVerificationAction);

router
  .route("/meetingplanvote/:id")
  //update the plan with the meeting approval vote
  .put(updateMeetingPlanVote);

router
  .route("/")
  // Get lit of all Therapy Plans
  .get(getTherapyplansAll)
  // Create new Therapy Plan
  .post(createTherapyplan);

module.exports = router;
