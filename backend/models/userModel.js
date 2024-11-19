"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: Schema.ObjectId },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  accessreason: { type: String },
  access_requested: { type: Boolean, default: false },
  granted_by: { type: String },
  active: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  role: { type: String },
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
 * @typedef Therapyplan
 */

module.exports = UserSchema;
