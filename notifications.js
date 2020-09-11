const { Alert } = require("./models/index");

class AlertData {
  constructor(title, payLoad, type) {
    this.title = title;
    this.payLoad = payLoad;
    this.type = type;
  }
}

var jobActive = new AlertData(
  "A job you posted is now active",
  "It will be made available for bidding. Go to 'My services' page to see this",
  "JOBS"
);

var bidAccepted = new AlertData(
  "Congratulations, your bid was accepted!",
  "You have just been hired! Proceed to the jobs page for more details",
  "JOBS"
);

var bidsReceived = new AlertData(
  "You have a new bid",
  "A user has just left a bid on one of your services",
  "MY_SERVICES"
);

var jobComplete = new AlertData(
  "Job completed.",
  "Your agent has marked one of your jobs completed. You can check this and respond in the jobs page",
  "JOBS"
);

var jobClosed = new AlertData(
  "Job closed.",
  "Your client has marked one of your jobs closed. You may review the client in the jobs page",
  "JOBS"
);

var leaveClientReview = new AlertData(
  "Review reminder",
  "Please leave a review for the client to help other agents find them",
  "REVIEW"
);

var leaveAgentReview = new AlertData(
  "Review reminder",
  "Please leave a review for the agent to help other clients find them",
  "REVIEW"
);

//creates a new entry
function createAlert(userId, title, payload, createdFor, type) {
  Alert.create({
    createdBy: userId,
    title: title,
    payload: payload,
    createdFor: createdFor,
    type: type,
    isSeen: false,
  }).then(console.log("Alert created"));
}

module.exports = {
  jobStatusActive: jobActive,
  bidAccepted: bidAccepted,
  bidsReceived: bidsReceived,
  jobComplete: jobComplete,
  jobClosed: jobClosed,
  leaveClientReview: leaveClientReview,
  leaveAgentReview: leaveAgentReview,
  createAlert: createAlert,
};
