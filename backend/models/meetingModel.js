"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
  meeting_date: { type: Date },
  meeting_time: { type: String },
  location: { type: String },
  meeting_link: { type: String },
  attendees: [
    {
      name: { type: String },
    },
  ],
  status: { type: String },
  notes: { type: String },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef Specialty
 */

module.exports = MeetingSchema;
