"use strict";
const TherapyPlanSchema = require("../models/therapyplanModel");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const apiResponse = require("../helpers/apiResponse");

const Therapyplan = mongoose.model("Therapyplan", TherapyPlanSchema);

exports.createTherapyplan = (req, res) => {
  //Validate request
  if (!req.body) {
    return apiResponse.ErrorResponse(res, "Therapy Plan cannot be empty....");
  }

  const therapyplan = new Therapyplan(req.body);
  therapyplan._id = new mongoose.Types.ObjectId();

  therapyplan
    .save()
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Created new Therapy Plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getTherapyplansAll = (req, res) => {
  Therapyplan.find()
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved all therapy plans",
          []
        );
      } else {
        if (plans.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all therapy plans",
            plans
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all therapy plans",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.updateTherapyplan = (req, res) => {
  Therapyplan.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  });
};

exports.getMeetingDates = (req, res) => {
  let query = [
    {
      $project: {
        "meeting.agenda_date": 1,
        _id: 0,
      },
    },
    {
      $unwind: {
        path: "$meeting",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$meeting.agenda_date",
      },
    },
    {
      $project: {
        meeting_date: "$_id",
        _id: 0,
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved all meeting dates",
          []
        );
      } else {
        if (plans.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all meeting dates",
            plans
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all meeting dates",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getMeetingAgendas = (req, res) => {
  Therapyplan.find()
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved all therapy plans",
          []
        );
      } else {
        if (plans.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all therapy plans",
            plans
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all therapy plans",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getTherapyPlanById = (req, res) => {
  Therapyplan.find({ _id: req.params.id })
    .then((plan) => {
      if (typeof plan === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan",
          plan
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getTherapyplansList = (req, res) => {
  let query = [
    {
      $project: {
        number: 1,
        medicationname: 1,
        specialty: 1,
        status: 1,
        requestor: 1,
        created: "$created.created_date",
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan list",
          []
        );
      } else {
        if (plans.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved therapy plan list",
            plans
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved therapy plan list",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getNextPlanNumber = (req, res) => {
  let query = [
    { $project: { nextNumber: { $substr: ["$number", 3, -1] } } },
    { $sort: { nextNumber: -1 } },
    { $limit: 1 },
  ];

  Therapyplan.aggregate(query)
    .then((nextplannumber) => {
      return apiResponse.successResponseWithData(
        res,
        "Retrieved next available number for therapy plans",
        nextplannumber
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getPlanLockStatus = (req, res) => {
  let query = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $project: {
        lockedby: "$lock.lockedby",
        isLocked: "$lock.isLocked",
        lockdate: "$lock.lockdate",
        _id: 0,
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((plan) => {
      if (typeof plan === "undefined") {
        return apiResponse.successResponse(
          res,
          "Found no therapy plan locks",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan lock status",
          plan
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.lockPlan = (req, res) => {
  Therapyplan.updateOne(
    { _id: req.params.id },
    {
      $set: {
        "lock.isLocked": true,
        "lock.lockedby": req.body.user,
        "lock.lockdate": new Date().toISOString(),
      },
    }
  )
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Locked therapy plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.removePlanLock = (req, res) => {
  Therapyplan.updateOne(
    { _id: req.params.id },
    {
      $unset: {
        "lock.isLocked": "",
        "lock.lockedby": "",
        "lock.lockdate": "",
      },
    }
  )
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Removed therapy plan lock",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.saveMeetingDate = (req, res) => {
  let agendadate = req.body.agendadate;
  Therapyplan.updateOne(
    { _id: req.params.id },
    {
      $set: {
        "meeting.agenda_date": agendadate,
        status: "Meeting",
      },
    }
  )
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved meeting date for therapy plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getFutureMeetingDates = (req, res) => {
  let query = [
    {
      $match: {
        "meeting.agenda_date": {
          $gte: new Date(),
        },
      },
    },
    {
      $project: {
        // meetingdates: "$meeting.agenda_date",
        meetingdates: {
          $dateToString: { format: "%m-%d-%Y", date: "$meeting.agenda_date" },
        },
        _id: 0,
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((meetingdates) => {
      if (typeof meetingdates === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan meeting dates",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan meeting dates",
          meetingdates
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getFutureMeetingDetails = (req, res) => {
  // let query = [
  // {
  //   $match: {
  //     "meeting.agenda_date": {
  //       $gte: new Date(),
  //     },
  //   },
  // },
  //   {
  //     $addFields: {
  //       planinfo: {
  //         $concatArrays: [["$number"], ["$medicationname"], ["$requestor"]],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       meetingdates: {
  //         $dateToString: {
  //           format: "%m-%d-%Y",
  //           date: "$meeting.agenda_date",
  //         },
  //       },
  //       number: 1,
  //       medicationname: 1,
  //       requestor: 1,
  //       planinfo: 1,
  //       _id: 0,
  //     },
  //   },
  //   {
  //     $sort: {
  //       meetingdates: 1,
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$meetingdates",
  //       planinfo: {
  //         $push: "$planinfo",
  //       },
  //     },
  //   },
  // ];

  let query = [
    {
      $match: {
        "meeting.agenda_date": {
          $exists: true,
          $ne: "",
        },
      },
    },
    {
      $addFields: {
        planinfo: {
          $concatArrays: [["$number"], ["$medicationname"], ["$requestor"]],
        },
      },
    },
    {
      $project: {
        meetingdates: {
          $dateToString: {
            format: "%m-%d-%Y",
            date: "$meeting.agenda_date",
          },
        },
        number: 1,
        medicationname: 1,
        requestor: 1,
        planinfo: 1,
        _id: 0,
      },
    },
    {
      $group: {
        _id: "$meetingdates",
        planinfo: {
          $push: "$planinfo",
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((meetingdates) => {
      if (typeof meetingdates === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan meeting dates",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan meeting dates",
          meetingdates
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getPlansForMeeting = (req, res) => {
  Therapyplan.find({ "meeting.agenda_date": req.params.meetingdate })
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plans for meeting date",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plans for meeting date",
          plans
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getReviewList = (req, res) => {
  let query = [
    {
      $match: {
        status: "In Review",
      },
    },
    {
      $project: {
        number: 1,
        medicationname: 1,
        specialty: 1,
        requestor: 1,
        status: 1,
        assignedreviewer: "$assignedReviewer.user",
        created: "$created.created_date",
        locked: "$lock.isLocked",
        lockedby: "$lock.lockedby",
        lockdate: "$locked.lockdate",
      },
    },
    {
      $sort: {
        number: 1,
        medicationname: 1,
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan list in review",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan list in review",
          plans
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getBuildList = (req, res) => {
  let query = [
    {
      $match: {
        status: "Build",
      },
    },
    {
      $project: {
        number: 1,
        medicationname: 1,
        specialty: 1,
        requestor: 1,
        status: 1,
        assignedbuilder: "$assignedBuilder.user",
        created: "$created.created_date",
        locked: "$lock.isLocked",
        lockedby: "$lock.lockedby",
        lockdate: "$locked.lockdate",
      },
    },
    {
      $sort: {
        number: 1,
        medicationname: 1,
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan list approved for build",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan list approved for build",
          plans
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getVerificationList = (req, res) => {
  let query = [
    {
      $match: {
        status: "Verification",
      },
    },
    {
      $project: {
        number: 1,
        medicationname: 1,
        specialty: 1,
        requestor: 1,
        status: 1,
        assignedverifier: "$assignedVerifier.user",
        created: "$created.created_date",
        locked: "$lock.isLocked",
        lockedby: "$lock.lockedby",
        lockdate: "$locked.lockdate",
      },
    },
    {
      $sort: {
        number: 1,
        medicationname: 1,
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan list ready for verification",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan list ready for verification",
          plans
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getAuditTrail = (req, res) => {
  let query = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $addFields: {
        reviewers: {
          $map: {
            input: "$reviewer",
            as: "row",
            in: {
              role: "Review",
              action: "$$row.action",
              user: "$$row.user",
              comment: "$$row.comment",
              dated: "$$row.modified_date",
            },
          },
        },
      },
    },
    {
      $project: {
        reviewers: 1,
        meeting: 1,
        builder: 1,
        verifier: 1,
        actionstaken: 1,
        created: 1,
        modified_date: 1,
      },
    },
  ];

  Therapyplan.aggregate(query)
    .then((plans) => {
      if (typeof plans === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan audit trail",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved therapy plan audit trail",
          plans
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.submitForReview = (req, res) => {
  let approval = req.body.approval;
  Therapyplan.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: "In Review",
        workflowStartReviewer: new Date().toISOString(),
      },
    }
  )
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Therapy plan submitted for review",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.saveReviewAction = (req, res) => {
  let action = req.body.action;
  let assigned = req.body.assigned;
  let currentuser = req.body.currentuser;
  let comment = req.body.comment;

  let updateFields;
  if (comment.length) {
    updateFields = {
      $push: {
        reviewer: {
          user: currentuser,
          action: action,
          comments: comment,
          modified_date: new Date().toISOString(),
          created_date: assigned,
        },
      },
      $set: { status: action },
      $unset: { workflowStartReviewer: "" },
    };
  } else {
    updateFields = {
      $push: {
        reviewer: {
          user: currentuser,
          action: action,
          modified_date: new Date().toISOString(),
          created_date: assigned,
        },
      },
      $set: { status: action },
      $unset: { workflowStartReviewer: "" },
    };
  }

  Therapyplan.updateOne({ _id: req.params.id }, updateFields)
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved reviewed vote for therapy plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.saveBuildAction = (req, res) => {
  let assigned = req.body.assigned;
  let currentuser = req.body.currentuser;
  let comment = req.body.comment;

  let updateFields;
  if (comment.length) {
    updateFields = {
      $push: {
        builder: {
          user: currentuser,
          action: "Build Complete",
          comments: comment,
          modified_date: new Date().toISOString(),
          created_date: assigned,
        },
      },
      $set: { status: "Verification" },
      $unset: { workflowStartBuilder: "" },
    };
  } else {
    updateFields = {
      $push: {
        builder: {
          user: currentuser,
          action: "Build Complete",
          modified_date: new Date().toISOString(),
          created_date: assigned,
        },
      },
      $set: { status: "Verification" },
      $unset: { workflowStartBuilder: "" },
    };
  }

  Therapyplan.updateOne({ _id: req.params.id }, updateFields)
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved build completion for therapy plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.saveVerificationAction = (req, res) => {
  let action = req.body.action;
  let assigned = req.body.assigned;
  let currentuser = req.body.currentuser;
  let comment = req.body.comment;

  let nextStatus = action === "Revise" ? "Build Revise" : "Complete";

  let updateFields;
  if (comment.length) {
    updateFields = {
      $push: {
        verifier: {
          user: currentuser,
          action: action,
          comments: comment,
          modified_date: new Date().toISOString(),
          created_date: assigned,
        },
      },
      $set: { status: nextStatus },
      $unset: { workflowStartVerifier: "" },
    };
  } else {
    updateFields = {
      $push: {
        verifier: {
          user: currentuser,
          action: action,
          modified_date: new Date().toISOString(),
          created_date: assigned,
        },
      },
      $set: { status: nextStatus },
      $unset: { workflowStartVerifier: "" },
    };
  }

  Therapyplan.updateOne({ _id: req.params.id }, updateFields)
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved build completion for therapy plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.updateMeetingPlanVote = (req, res) => {
  let meeting = req.body;
  let updateFields;
  updateFields = {
    $set: {
      meeting,
      workflowStartBuilder: new Date().toISOString(),
    },
  };

  Therapyplan.updateOne({ _id: req.params.id }, updateFields, {
    runValidators: true,
  })
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved updates to therapy plan meeting vote",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.assignReviewer = (req, res) => {
  let assigneduser = req.body.user;
  Therapyplan.updateOne(
    { _id: req.params.id },
    {
      $set: {
        assignedReviewer: {
          user: assigneduser,
          created_date: new Date().toISOString(),
        },
      },
    }
  )
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Reviewer assignment saved to therapy plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};
exports.assignBuilder = (req, res) => {
  let assigneduser = req.body.user;
  Therapyplan.updateOne(
    { _id: req.params.id },
    {
      $set: {
        assignedBuilder: {
          user: assigneduser,
          created_date: new Date().toISOString(),
        },
      },
    }
  )
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Builder assignment saved to therapy plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.assignVerifier = (req, res) => {
  let assigneduser = req.body.user;
  Therapyplan.updateOne(
    { _id: req.params.id },
    {
      $set: {
        assignedVerifier: {
          user: assigneduser,
          created_date: new Date().toISOString(),
        },
      },
    }
  )
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Verifier assignment saved to therapy plan",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};
