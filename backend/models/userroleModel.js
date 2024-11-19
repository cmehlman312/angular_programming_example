"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRoleSchema = new Schema({
  userrole: { type: String },
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
 * @typedef UserRole
 */

module.exports = UserRoleSchema;
