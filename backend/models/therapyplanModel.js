"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TherapyPlanSchema = new Schema({
  _id: { type: Schema.ObjectId },
  number: { type: String },
  medicationname: { type: String },
  status: { type: String },
  requestor: { type: String },
  specialty: {
    rheumatology: { type: Boolean },
    gastroenterology: { type: Boolean },
    neurology: { type: Boolean },
    endocrinology: { type: Boolean },
    supportive: { type: Boolean },
  },
  requiredlabs: [
    {
      lab: { type: String },
      interval: { type: String },
      custominterval: { type: String },
      comments: { type: String },
    },
  ],
  treatmentinformation: [
    {
      treatment: { type: String },
      interval: { type: String },
      custominterval: { type: String },
    },
  ],
  treatmentparameters: [
    {
      parameter: { type: String },
      interval: { type: String },
      custominterval: { type: String },
    },
  ],
  vitals: [
    {
      vitals: { type: String },
      interval: { type: String },
      custominterval: { type: String },
      comments: { type: String },
    },
  ],
  premedications: [
    {
      premedication: { type: String },
      dose: { type: String },
      adminduration: { type: String },
      route: { type: String },
      frequency: { type: String },
      rate: { type: String },
      admininstructions: { type: String },
      interval: { type: String },
      custominterval: { type: String },
      comments: { type: String },
    },
  ],
  hydration: [
    {
      hydration: { type: String },
      dose: { type: String },
      adminduration: { type: String },
      route: { type: String },
      frequency: { type: String },
      rate: { type: String },
      admininstructions: { type: String },
      interval: { type: String },
      custominterval: { type: String },
      comments: { type: String },
    },
  ],
  nonchemomedicationorders: [
    {
      nonchemomedicationorder: { type: String },
      dose: { type: String },
      adminduration: { type: String },
      route: { type: String },
      frequency: { type: String },
      rate: { type: String },
      admininstructions: { type: String },
      interval: { type: String },
      custominterval: { type: String },
      comments: { type: String },
    },
  ],
  postmedications: [
    {
      postmedication: { type: String },
      dose: { type: String },
      adminduration: { type: String },
      route: { type: String },
      frequency: { type: String },
      rate: { type: String },
      admininstructions: { type: String },
      interval: { type: String },
      custominterval: { type: String },
      comments: { type: String },
    },
  ],
  emergencymedications: [
    {
      emergencymedication: { type: String },
      dose: { type: String },
      adminduration: { type: String },
      route: { type: String },
      frequency: { type: String },
      rate: { type: String },
      admininstructions: { type: String },
      interval: { type: String },
      custominterval: { type: String },
      comments: { type: String },
    },
  ],
  takehomemedications: [
    {
      takehomemedication: { type: String },
      dose: { type: String },
      adminduration: { type: String },
      route: { type: String },
      frequency: { type: String },
      rate: { type: String },
      admininstructions: { type: String },
      interval: { type: String },
      custominterval: { type: String },
      comments: { type: String },
    },
  ],
  assignedReviewer: {
    user: { type: String },
    created_date: { type: Date },
  },
  reviewer: [
    {
      user: { type: String },
      action: { type: String },
      comments: { type: String },
      modified_date: { type: Date },
      created_date: { type: Date },
    },
  ],
  meeting: {
    agenda_date: { type: Date },
    approved: { type: Boolean, default: false },
    approved_by: { type: String },
    approved_date: { type: Date },
    notesfrommeeting: { type: String },
  },
  assignedBuilder: {
    user: { type: String },
    created_date: { type: Date },
  },
  builder: [
    {
      user: { type: String },
      action: { type: String },
      comments: { type: String },
      modified_date: { type: Date },
      created_date: { type: Date },
    },
  ],
  assignedVerifier: {
    user: { type: String },
    created_date: { type: Date },
  },
  verifier: [
    {
      user: { type: String },
      action: { type: String },
      comments: { type: String },
      modified_date: { type: Date },
      created_date: { type: Date },
    },
  ],
  actionstaken: {
    user: { type: String },
    event: { type: String },
    created_date: { type: Date, default: Date.now },
  },
  lock: {
    isLocked: { type: Boolean, default: false },
    lockedby: { type: String },
    lockdate: { type: Date, default: Date.now },
  },
  created: {
    created_date: { type: Date, default: Date.now },
    user: { type: String },
  },
  modified_date: {
    type: Date,
    default: Date.now,
  },
  workflowStartReviewer: { type: Date },
  workflowStartBuilder: { type: Date },
  workflowStartVerifier: { type: Date },
});

/**
 * @typedef Therapyplan
 */

module.exports = TherapyPlanSchema;
