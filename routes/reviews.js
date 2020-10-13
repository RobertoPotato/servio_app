const express = require("express");
const { Review, User, Job } = require("../models/index");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { JOB_COMPLETED } = require("../statusCodes");

const router = express.Router();
//end request if job isnt marked complete

//get the agent's or client's ID based on value from isClient
//console.log("Fetching review for a job of id: " + req.params.jobid);
//* creates a new entry
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const review = await Review.create({
      stars: req.body.stars,
      content: req.body.content,
      subjectId: req.body.agentId,
      reviewerId: req.body.clientId,
      jobId: req.body.jobId,
    });

    res.send(review);
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

    if (job == null || job == "")
      return res.status(404).send({ error: "Job not found" });

    //end request if current user is neither agent nor client

    /*
    if (job.agentId != req.user.userId) {
      if (job.clientId != req.user.userId) {
        return res.status(400).send({ error: "Insufficient permissions" });
      }
    }
    */

    var review = await Review.findOne({
      where: {
        reviewerId: 101 /*req.user.userId*/,
        jobId: 421 /*req.params.jobid*/,
      },
      attributes: {
        exclude: ["createdAt", "subjectId", "jobId"],
      },
    });

    if (review == null) {
      console.log("No review");
      return res.status(404).send({ error: "No review" });
    }

    console.log(review);
    res.status(200).send(review);
  })
);

module.exports = router;

/* if (job.statusId != JOB_COMPLETED)
      return res
        .status(404)
        .send({
          error: "Job must be marked completed before leaving a review",
        });*/
