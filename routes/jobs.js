const express = require("express");
const { Job, User, Service, Status, Bid } = require("../models/index");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");

const router = express.Router();

//creates a new entry
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const job = await Job.create({
      clientId: req.user.userId,
      agentId: req.body.agentId,
      bidId: req.body.bidId,
      serviceId: req.body.serviceId,
      statusId: req.body.statusId,
    });

    res.send(job);
  })
);

//updates the data
//? Marks job as done = done by agent
router.put(
  "/:jobid/done",
  auth,
  asyncMiddleware(async (req, res) => {
    Job.update(
      {
        statusId: req.body.statusId,
      },
      {
        where: {
          id: req.params.jobid,
          agentId: req.user.userId,
        },
      }
    ).then(res.status(200).send("Ok"));
  })
);

//? Marks job as complete = done by client
router.put(
  "/:jobid/complete",
  auth,
  asyncMiddleware(async (req, res) => {
    Job.update(
      {
        statusId: req.body.statusId,
      },
      {
        where: {
          id: req.params.jobid,
          clientId: req.user.userId,
        },
      }
    ).then(res.status(200).send("Ok"));
  })
);

//gets data on specific based on id
//TODO Make it so that either client or agent can get this info
router.get(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const job = await Job.findAll({
      where: {
        id: req.params.id,
      },
    });

    res.send(job);
  })
);

//* load jobs of a particular client
router.get(
  "/forclient/:smtn",
  auth,
  asyncMiddleware(async (req, res) => {
    const tasks = await Job.findAll({
      attributes: ["id", "createdAt", "clientId", "agentId"],
      include: [
        { model: User, as: "client", attributes: ["firstName", "lastName"] },
        { model: User, as: "agent", attributes: ["firstName", "lastName"] },
        {
          model: Bid,
          attributes: { exclude: ["id", "userId", "serviceId", "updatedAt"] },
        },
        {
          model: Service,
          attributes: {
            exclude: ["id", "userId", "categoryId", "statusId", "updatedAt"],
          },
        },
        {
          model: Status,
          attributes: { exclude: ["id", "createdAt", "updatedAt"] },
        },
      ],
      where: {
        clientId: req.user.userId,
      },
    });

    res.send(tasks);
  })
);

//* load jobs of a particular agent
//! Ignore the smtn item in the url
router.get(
  "/foragent/:smtn",
  auth,
  asyncMiddleware(async (req, res) => {
    const tasks = await Job.findAll({
      where: { agentId: req.user.userId },
      attributes: ["id", "createdAt", "clientId", "agentId"],
      include: [
        { model: User, as: "client", attributes: ["firstName", "lastName"] },
        { model: User, as: "agent", attributes: ["firstName", "lastName"] },
        {
          model: Bid,
          attributes: { exclude: ["id", "userId", "serviceId", "updatedAt"] },
        },
        {
          model: Service,
          attributes: {
            exclude: ["id", "userId", "categoryId", "statusId", "updatedAt"],
          },
        },
        {
          model: Status,
          attributes: { exclude: ["id", "createdAt", "updatedAt"] },
        },
      ],
    });

    res.send(tasks);
  })
);

module.exports = router;
