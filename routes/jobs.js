const express = require("express");
const { Job, User, Service, Status, Bid } = require("../models/index");
const auth = require("../middleware/auth");

// list of fillable fields
// clientId
// agentId
// bidId
// serviceId
// statusId

const router = express.Router();

//creates a new entry
router.post("/", async (req, res) => {
  const job = await Job.create({
    clientId: req.body.clientId,
    agentId: req.body.agentId,
    bidId: req.body.bidId,
    serviceId: req.body.serviceId,
    statusId: req.body.statusId,
  });

  res.send(job);
});

//updates the data
//? Marks job as done
router.put("/:jobid/:agentid/done", (req, res) => {
  Job.update(
    {
      statusId: req.body.statusId,
    },
    {
      where: {
        id: req.params.jobid,
      },
    }
  ).then(res.status(200).send("Ok"));
});

//? Marks job as complete
router.put("/:jobid/:clientid/complete", (req, res) => {
  Job.update(
    {
      statusId: req.body.statusId,
    },
    {
      where: {
        id: req.params.jobid,
      },
    }
  ).then(res.status(200).send("Ok"));
});

//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const job = await Job.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(job);
});

//TODO Get all jobs for a particular user, either services whose
//TODO bids were awarded or services they posted
//gets all entries from db
//?do we really want to get a list of all jobs?
router.get("/", (req, res) => {
  res.send("Invalid operation: Cannot get list of all jobs");
});

//! the only thing that will change is the status
//! operation to only be performed by admin
//* updates the data
router.put("/:id", (req, res) => {
  Job.update(
    {
      statusId: req.body.statusId,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(res.send("Job updated"));
});

//delets a particular entry.
router.delete("/:id", (req, res) => {
  res.send("Invalid operation: Cannot delete a job");
});

router.get("/client/:id", auth, async (req, res) => {
  const jobs = await Job.findAll({
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

  res.send(jobs);
});

//* load jobs of a particular client
router.get("/forclient", auth, async (req, res) => {
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
});

//* load jobs of a particular agent
//! Ignore the smtn item in the url. It just works with that there and
//! I dont know why it fails when its not there
router.get("/foragent/:smtn", auth, async (req, res) => {
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
});

module.exports = router;
