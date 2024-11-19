"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecialtySchema = new Schema({
  specialty: { type: String },
  active: { type: Boolean, default: true },
  modified_date: {
    type: Date,
    default: Date.now,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef Specialty
 */

module.exports = SpecialtySchema;
