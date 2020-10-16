const express = require("express");
const { Review, User, Job } = require("../models/index");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { JOB_COMPLETED } = require("../statusCodes");
const { toInteger } = require("lodash");

const router = express.Router();
//end request if job isnt marked complete

//get the agent's or client's ID based on value from isClient
//console.log("Fetching review for a job of id: " + req.params.jobid);
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

    //end request if job isn't complete
    if (job.statusId !== JOB_COMPLETED)
      return res
        .status(400)
        .send({ error: "Job has not been marked complete" });

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
  "/foruser/:userId",
  auth,
  asyncMiddleware(async (req, res) => {
    const reviews = await Review.findAll({
      where: {
        subjectId: req.params.userId,
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

    console.log(review);
    res.status(200).send(review);
  })
);

module.exports = router;
