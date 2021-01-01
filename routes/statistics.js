const express = require('express');
const auth = require('../middleware/auth');
const { Review, Job, Bid, Service } = require('../models/index');
const { JOB_COMPLETED, JOB_STALLED } = require('../statusCodes');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const sequelize = require('sequelize');

const router = express.Router();

router.get(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    var bid_count;
    var job_count;
    var jobs_completed;
    var jobs_stalled;
    var jobs_created;
    var services_count;
    var average_rating;

    //var userId = 1;
    var userId = req.user.userId;
    //number of bids the user has sent
    var bids = await Bid.count({
      distinct: 'id',
      where: {
        userId: userId,
      },
    });

    if (!bids) {
      bid_count = 0;
    } else {
      bid_count = bids;
    }

    //number of jobs the user has been awarded
    var jobs = await Job.count({
      distinct: 'id',
      where: {
        agentId: userId,
      },
    });

    if (!jobs) {
      job_count = 0;
    } else {
      job_count = jobs;
    }

    //number of jobs the user has completed
    var jobsCompleted = await Job.count({
      distinct: 'id',
      where: {
        agentId: userId,
        statusId: JOB_COMPLETED,
      },
    });

    if (!jobsCompleted) {
      jobs_completed = 0;
    } else {
      jobs_completed = jobsCompleted;
    }

    //number of jobs awarded but not completed
    var jobsStalled = await Job.count({
      distinct: 'id',
      where: {
        agentId: userId,
        statusId: JOB_STALLED,
      },
    });

    if (!jobsStalled) {
      jobs_stalled = 0;
    } else {
      jobs_stalled = jobsStalled;
    }

    //number of jobs the user has created
    var jobsCreated = await Job.count({
      distinct: 'id',
      where: {
        clientId: userId,
      },
    });

    if (jobsCreated == null) {
      jobs_created = 0;
    } else {
      jobs_created = jobsCreated;
    }

    //number of services the user has posted
    var servicesCount = await Service.count({
      distinct: 'id',
      where: {
        userId: userId,
      },
    });

    if (!servicesCount) {
      services_count = 0;
    } else {
      services_count = servicesCount;
    }

    //The user's average rating
    var avgReviews = await Review.findAll({
      attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avg']],
      where: {
        subjectId: userId,
      },
    });

    //if the average is empty or inexistent, return a 0. Else return the value
    if (!avgReviews || avgReviews[0].dataValues.avg == null) {
      average_rating = 0;
    } else {
      average_rating = avgReviews[0].dataValues.avg;
    }

    //! Ratio of successful bids to bids sent => Bidding success rate => Will be calculated on client device
    //! Hiring rate jobs_created/services_count Will be calculated on client device

    res.status(200).send({
      bid_count,
      job_count,
      jobs_completed,
      jobs_stalled,
      jobs_created,
      services_count,
      average_rating,
    });
  })
);

router.get('/test', async (req, res) => {
  var avgReviews = await Review.findAll({
    attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avg']],
    where: {
      subjectId: 101,
    },
  });
  res.send(avgReviews);
});

module.exports = router;
