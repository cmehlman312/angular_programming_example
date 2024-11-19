const express = require("express");
const router = express.Router();

const {
  createUserRole,
  getUserRoleList,
  updateUserRole,
} = require("../../controllers/userroleController");

router
  .route("/:id")
  // Update an existing User Role
  .put(updateUserRole);

router
  .route("/")
  // Get list of all User Roles
  .get(getUserRoleList)
  // Create new User Role
  .post(createUserRole);

module.exports = router;
