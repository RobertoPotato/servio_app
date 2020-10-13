//Services

//is open for bidding
//these will be shown in the categories for bidding
const SERVICE_ACTIVE = 1;

//assigned to a bidder -> when user accepts a bid
//other bidders not selected will be informed
const SERVICE_ASSIGNED = 2;

//! for future references
//needs more bidders ie employ more people for the same service
//can already have some bidders assigned but will still be open for bidding till limit is reached
const SERVICE_MULTIPLE_HIRES = 3;

//under review or moderation
//if sservice is reported or has issues
const SERVICE_UNDER_REVIEW = 4;

//service not available
//user has withdrawn their service but not deleted
const SERVICE_NOT_AVAILABLE = 5;

//Jobs
//job has started
//service will need to be marked as assigned first: id: 2
const JOB_STARTED = 6;

//job is completed - marked by client
//the job status id should be 6 or 8 before it changes to 7. only client can change this
const JOB_COMPLETED = 7;

//job is done - marked by agent
//status should be 6 first, indicating job started
const JOB_DONE = 8;
//job is stalled - marked by admin
const JOB_STALLED = 9;

module.exports = {
  SERVICE_ACTIVE: SERVICE_ACTIVE,
  SERVICE_ASSIGNED: SERVICE_ASSIGNED,
  SERVICE_MULTIPLE_HIRES: SERVICE_MULTIPLE_HIRES,
  SERVICE_UNDER_REVIEW: SERVICE_UNDER_REVIEW,
  SERVICE_NOT_AVAILABLE: SERVICE_NOT_AVAILABLE,
  JOB_STARTED: JOB_STARTED,
  JOB_COMPLETED: JOB_COMPLETED,
  JOB_DONE: JOB_DONE,
  JOB_STALLED: JOB_STALLED,
};
