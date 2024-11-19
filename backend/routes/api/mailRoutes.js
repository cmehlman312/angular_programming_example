const express = require("express");
const router = express.Router();

const {
  createMailMessage,
  updateMailMessage,
  deleteMailMessage,
  getMailMessage,
  getAllMailMessages,
  getMailMessageList,
  getMailMessageById,
  sendReviewRejected,
  sendReviewRevise,
  sendVerificationRevise,
  sendVerificationApproved,
  sendEmailGrantUserAccess,
  sendAccessRequestMessage,
} = require("../../controllers/mailController");

router
  .route("/sendreviewrejected")
  // Send mail message for review reject
  .get(sendReviewRejected);

router
  .route("/sendreviewrevise")
  // Send mail message for review reject
  .get(sendReviewRevise);

router
  .route("/sendverificationapproved")
  // Send mail message for verification approved
  .get(sendVerificationApproved);

router
  .route("/sendverificationrevise")
  // Send mail message for review reject
  .get(sendVerificationRevise);

router
  .route("/sendEmailGrantUserAccess")
  // Send mail message for review reject
  .get(sendEmailGrantUserAccess);

router
.route("/sendAccessRequestMessage")
// Send access request email 
.get(sendAccessRequestMessage);

router
  .route("/message/:workflowstep")
  // Update an existing mail message
  .get(getMailMessage);

router
  .route("/list")
  // Update an existing mail message
  .get(getMailMessageList);

router
  .route("/:id")
  // Get mail message by id
  .get(getMailMessageById)
  // Update mail message details
  .put(updateMailMessage)
  // Delete mail message
  .delete(deleteMailMessage);

router
  .route("/")
  // Get all mail messages
  .get(getAllMailMessages)
  // Create new mail message
  .post(createMailMessage);

module.exports = router;
