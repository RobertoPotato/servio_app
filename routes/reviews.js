const express = require("express");
const { Review, User, Job, Bid } = require("../models/index");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { JOB_COMPLETED } = require("../statusCodes");

const router = express.Router();

//* creates a new entry
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    console.log(req.body);
    //confirm job exists
    var job = await Job.findOne({
      where: {
        id: req.body.jobId,
      },
    });

    //end request if job doesnt exist
    if (!job) return res.status(400).send({ error: "Bad request" });
    console.log("passed job existence");

    console.log(
      "Job status: " + job.statusId + "\n passed status: " + JOB_COMPLETED
    );
    //end request if job isn't complete
    if (job.statusId !== JOB_COMPLETED)
      return res
        .status(400)
        .send({ error: "Job has not been marked complete" });
    console.log("passed job completion");

    //set the subjectId
    var subjId = req.body.userIsClient ? job.agentId : job.clientId;

    //end request if subject and reviewer IDs match
    if (req.user.userId == subjId)
      return res.status(400).send({ error: "Invalid token" });

    //find existing review matching given params
    var existsReview = await Review.findOne({
      where: {
        jobId: req.body.jobId,
        reviewerId: req.user.userId,
        subjectId: subjId,
      },
    });

    //end request if review has already been made
    if (existsReview)
      return res
        .status(400)
        .send({ error: "A review for this user on this job already exists" });

    //if all is ok, create the review
    const review = await Review.create({
      stars: req.body.stars,
      content: req.body.content,
      subjectId: subjId,
      reviewerId: req.user.userId,
      jobId: req.body.jobId,
    });

    console.log(review);

    res.status(200).send({ message: "OK" });
  })
);

router.get(
  "/foruser",
  auth,
  asyncMiddleware(async (req, res) => {
    console.log("Fetching reviews");
    const reviews = await Review.findAll({
      where: {
        subjectId: req.user.userId,
      },
      attributes: ["stars", "content", "updatedAt"],
      include: { model: User, attributes: ["firstName", "lastName"] },
    });

    res.send(reviews);
  })
);

//* gets data on specific based on id
router.get(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const review = await Review.findAll({
      where: {
        id: req.params.id,
      },
    });

    res.send(review);
  })
);

//? Should users be able to edit their reviews?
//* updates the data
router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    Review.update(
      {
        stars: req.body.stars,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then(res.send("Review updated"));
  })
);

router.get(
  "/job/:jobid",
  auth,
  asyncMiddleware(async (req, res) => {
    //end request if the job doesnt exist
    var job = await Job.findOne({
      where: {
        id: req.params.jobid,
      },
    });

    if (!job) return res.status(500).send({ error: "Job not found" });

    //end request if current user is neither agent nor client
    if (job.agentId != req.user.userId) {
      if (job.clientId != req.user.userId) {
        return res.status(401).send({ error: "Insufficient permissions" });
      }
    }

    var review = await Review.findOne({
      where: {
        reviewerId: req.user.userId,
        jobId: req.params.jobid,
      },
      attributes: {
        exclude: ["createdAt", "subjectId", "jobId"],
      },
    });

    if (review == null) return res.status(400).send({ error: "No review" });

    res.status(200).send(review);
  })
);

//* Get reviews for a user who has made a bid for a job
router.get(
  "/foruser/:bidId",
  auth,
  asyncMiddleware(async (req, res) => {
    console.log("Getting reviews for user with bid: " + req.params.bidId);
    var bid = await Bid.findOne({
      where: {
        id: req.params.bidId,
      },
    });

    if (!bid)
      return res
        .status(400)
        .send({ error: "Internal error, couldnt find that bid" });

    console.log("Passed bid exists.User id is " + bid.userId + " !");

    var reviews = await Review.findAll({
      where: {
        subjectId: bid.userId,
      },
      attributes: ["stars", "content", "updatedAt"],
      include: { model: User, attributes: ["firstName", "lastName"] },
    });

    res.status(200).send(reviews);
  })
);

module.exports = router;
