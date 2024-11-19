const express = require("express");
const router = express.Router();

const {
  createSpecialty,
  getSpecialtyList,
  updateSpecialty,
} = require("../../controllers/specialtyController");

router
  .route("/:id")
  // Update an existing specialty
  .put(updateSpecialty);

router
  .route("/")
  // Get list of all specialties
  .get(getSpecialtyList)
  // Create new specialty
  .post(createSpecialty);

module.exports = router;
