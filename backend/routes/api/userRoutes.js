const express = require("express");
const router = express.Router();

const {
  createUser,
  getUserList,
  updateUser,
  getUserById,
  getUserEmailInformation,
  getUserInformation,
  grantAccess,
  revokeAccess,
  getAdminEmailList,
} = require("../../controllers/userController");

router
  .route("/emailinformation")
  // get user information for email
  .get(getUserEmailInformation);

router
  .route("/userinformation/:userid")
  // Get user information based off os userid
  .get(getUserInformation);

router
  .route("/grantaccess/:id")
  //Grant user access
  .put(grantAccess);

router
  .route("/revokeaccess/:id")
  //Revoke user access
  .put(revokeAccess);

router
  .route("/adminemaillist")
  // Get list of email addresses for admins
  .get(getAdminEmailList);

router
  .route("/:id")
  // get a specific user
  .get(getUserById)
  // Update an existing User Role
  .put(updateUser);

router
  .route("/")
  // Get list of all User Roles
  .get(getUserList)
  // Create new User Role
  .post(createUser);

module.exports = router;
