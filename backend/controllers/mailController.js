"use strict";
const MailSchema = require("../models/mailModel");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const apiResponse = require("../helpers/apiResponse");

const Mail = mongoose.model("Mail", MailSchema);

const nodemailer = require("nodemailer");

const { siteurl, emailConfig } = require("../config/vars");

//initialize mail transport configuration
let transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: false,
});

exports.createMailMessage = (req, res) => {
  //Validate request
  if (!req.body) {
    return apiResponse.ErrorResponse(res, "Mail message cannot be empty....");
  }

  const newmessage = new Mail(req.body);
  newmessage._id = new mongoose.Types.ObjectId();

  newmessage
    .save()
    .then((plan) => {
      return apiResponse.successResponseWithData(
        res,
        "Created new Mail Message",
        plan
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getMailMessage = (req, res) => {
  Mail.find({ workflowstep: req.params.workflowstep })
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved mail message for workflow step",
          []
        );
      } else {
        if (mailmessage.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved mail message for workflow step",
            mailmessage
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved mail message for workflow step",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getAllMailMessages = (req, res) => {
  Mail.find()
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved all mail message for workflow step",
          []
        );
      } else {
        if (mailmessage.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all mail message for workflow step",
            mailmessage
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all mail message for workflow step",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getMailMessageList = (req, res) => {
  let query = [
    {
      $project: {
        workflowstep: 1,
        title: 1,
        subject: 1,
        status: 1,
        modified_date: 1,
      },
    },
  ];

  Mail.aggregate(query)
    .then((mailmessages) => {
      if (typeof mailmessages === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved all mail messages for list",
          []
        );
      } else {
        if (mailmessages.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all mail messages for list",
            mailmessages
          );
        } else {
          return apiResponse.successResponseWithData(
            res,
            "Retrieved all mail messages for list",
            []
          );
        }
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.updateMailMessage = (req, res) => {
  Mail.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  })
    .then((mailmessage) => {
      return apiResponse.successResponseWithData(
        res,
        "Saved updates to mail message",
        mailmessage
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.deleteMailMessage = (req, res) => {
  Mail.deleteOne({ _id: req.params.id })
    .then((mailmessage) => {
      return apiResponse.successResponseWithData(
        res,
        "Deleted mail message",
        mailmessage
      );
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.getMailMessageById = (req, res) => {
  Mail.find({ _id: req.params.id })
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved mail message",
          []
        );
      } else {
        return apiResponse.successResponseWithData(
          res,
          "Retrieved mail message",
          mailmessage
        );
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.sendReviewRejected = (req, res) => {
  let workflowstep = "review rejected";
  Mail.findOne({ workflowstep: workflowstep })
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponse(
          res,
          "Did not find any mail messages with specified workflow step name."
        );
      } else {
        let number = req.query.number;
        let medicationname = req.query.medicationname;
        let reason = req.query.reason;
        let emailto = req.query.email;
        let reviewer = req.query.reviewer;

        let messageBody = mailmessage["message"];
        messageBody = messageBody.replace(/{plannumber}/g, number);
        messageBody = messageBody.replace(/{medicationname}/g, medicationname);
        messageBody = messageBody.replace(/{reason}/g, reason);
        messageBody = messageBody.replace(/{reason}/g, reason);
        messageBody = messageBody.replace(/{reviewer}/g, reviewer);

        var mailOptions = {
          from: "no-reply@" + siteurl,
          to: emailto,
          subject: mailmessage["subject"],
          text: messageBody,
          html: messageBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          let tempRequest = {
            params: req.params,
            body: req.body,
            query: req.query,
            url: req.url,
            route: req.route,
          };

          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          res.json(info);
        });
      }
    })
    .catch((error) => {
      console.log("mail error");
      console.log(error);
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.sendReviewRevise = (req, res) => {
  let workflowstep = "review revise";
  Mail.findOne({ workflowstep: workflowstep })
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponse(
          res,
          "Did not find any mail messages with specified workflow step name."
        );
      } else {
        let number = req.query.number;
        let medicationname = req.query.medicationname;
        let reason = req.query.reason;
        let emailto = req.query.email;
        let reviewer = req.query.reviewer;

        let messageBody = mailmessage["message"];
        messageBody = messageBody.replace(/{plannumber}/g, number);
        messageBody = messageBody.replace(/{medicationname}/g, medicationname);
        messageBody = messageBody.replace(/{reason}/g, reason);
        messageBody = messageBody.replace(/{reason}/g, reason);
        messageBody = messageBody.replace(/{reviewer}/g, reviewer);

        var mailOptions = {
          from: "no-reply@" + siteurl,
          to: emailto,
          subject: mailmessage["subject"],
          text: messageBody,
          html: messageBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          let tempRequest = {
            params: req.params,
            body: req.body,
            query: req.query,
            url: req.url,
            route: req.route,
          };

          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          res.json(info);
        });
      }
    })
    .catch((error) => {
      console.log("mail error");
      console.log(error);
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.sendVerificationRevise = (req, res) => {
  let workflowstep = "verification revise";
  Mail.findOne({ workflowstep: workflowstep })
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponse(
          res,
          "Did not find any mail messages with specified workflow step name."
        );
      } else {
        let number = req.query.number;
        let medicationname = req.query.medicationname;
        let reason = req.query.reason;
        let emailto = req.query.email;
        let verifier = req.query.verifier;

        let messageBody = mailmessage["message"];
        messageBody = messageBody.replace(/{plannumber}/g, number);
        messageBody = messageBody.replace(/{medicationname}/g, medicationname);
        messageBody = messageBody.replace(/{reason}/g, reason);
        messageBody = messageBody.replace(/{verifier}/g, verifier);

        var mailOptions = {
          from: "no-reply@" + siteurl,
          to: emailto,
          subject: mailmessage["subject"],
          text: messageBody,
          html: messageBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          let tempRequest = {
            params: req.params,
            body: req.body,
            query: req.query,
            url: req.url,
            route: req.route,
          };

          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          res.json(info);
        });
      }
    })
    .catch((error) => {
      console.log("mail error");
      console.log(error);
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.sendVerificationApproved = (req, res) => {
  console.log("starting sendVerificationApproved");
  let workflowstep = "complete";
  Mail.findOne({ workflowstep: workflowstep })
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponse(
          res,
          "Did not find any mail messages with specified workflow step name."
        );
      } else {
        let number = req.query.number;
        let medicationname = req.query.medicationname;
        let emailto = req.query.email;

        let messageBody = mailmessage["message"];
        messageBody = messageBody.replace(/{plannumber}/g, number);
        messageBody = messageBody.replace(/{medicationname}/g, medicationname);

        var mailOptions = {
          from: "no-reply@" + siteurl,
          to: emailto,
          subject: mailmessage["subject"],
          text: messageBody,
          html: messageBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          let tempRequest = {
            params: req.params,
            body: req.body,
            query: req.query,
            url: req.url,
            route: req.route,
          };

          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          res.json(info);
        });
      }
    })
    .catch((error) => {
      console.log("mail error");
      console.log(error);
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.sendAccessRequestMessage = (req, res) => {
  let workflowstep = "access request";
  Mail.findOne({ workflowstep: workflowstep })
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponse(
          res,
          "Did not find any mail messages with specified workflow step name."
        );
      } else {
        let name = req.query.fullname;
        let accessreason = req.query.reason;
        let emaillist = req.query.emaillist;

        console.log(emaillist);

        let tempmessage = mailmessage["message"];
        let messageBody = tempmessage.replace("{NAME}", fullname);
        messageBody = messageBody.replace("{REASON}", accessreason);

        var mailOptions = {
          from: "no-reply@" + siteurl,
          to: emaillist,
          subject: mailmessage["subject"],
          text: messageBody,
          html: messageBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          res.json(info);
        });
      }
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.sendComposedMessage = function (mailOptions) {
  transporter
    .sendMail(mailOptions)
    .then((messageData) => {
      console.log("Message sent: %s", messageData.messageId);
    })
    .catch((error) => {
      return apiResponse.ErrorResponse(res, error);
    });
};

exports.sendEmailGrantUserAccess = (req, res) => {
  let workflowstep = "granted user access";
  Mail.findOne({ workflowstep: workflowstep })
    .then((mailmessage) => {
      if (typeof mailmessage === "undefined") {
        return apiResponse.successResponse(
          res,
          "Did not find any mail messages with specified workflow step name."
        );
      } else {
        let emailto = req.query.email;

        let messageBody = mailmessage["message"];
        messageBody = messageBody.replace(/{site_url}/g, "https://" + siteurl);

        var mailOptions = {
          from: "no-reply@" + siteurl,
          to: emailto,
          subject: mailmessage["subject"],
          text: messageBody,
          html: messageBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          let tempRequest = {
            params: req.params,
            body: req.body,
            query: req.query,
            url: req.url,
            route: req.route,
          };

          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          res.json(info);
        });
      }
    })
    .catch((error) => {
      console.log("mail error");
      console.log(error);
      return apiResponse.ErrorResponse(res, error);
    });
};
