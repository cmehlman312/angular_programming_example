"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailSchema = new Schema({
  _id: { type: Schema.ObjectId },
  workflowstep: { type: String },
  subject: { type: String },
  message: { type: String },
  status: { type: Boolean },
  modified_date: {
    type: Date,
    default: Date.now,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = MailSchema;
